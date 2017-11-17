(function ($) {

  Handlebars.registerHelper('ifequal', function(context, value, options) {
    if (context == value) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
  });

  $(document).ready(function () {

    if (window.user) {
      $.getJSON('/elections/active', function (ejson) {
        var source = $("#election-list-template").html();
        var template = Handlebars.compile(source);
        var elections = [];

        $.each(ejson.elections, function (i, e) {

          var voted = ejson.answers.filter(function(a){
            return a.election_id === e.id;
          });

          elections.push({
            id: e.id,
            title: e.title,
            date: e.election_date,
            status: voted.length ? 'inactive' : 'active'
          });
        });
        $(".elections").html(template({ elections: elections }));

        var today = new Date();
        $('.date').text((today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear());

        $('[id^=election-]').on('click', function(e){
          e.preventDefault();

          if($(this).hasClass('inactive')) {
            var $error = $(this).find('.error');
            $error.removeClass('hidden');

            setTimeout(function(){
              $error.addClass('hidden');
            }, 3000);

            return false;
          }

          var id = $(this).attr('id').replace('election-', '');

          $.getJSON('/ballots/' + id, function(bjson) {
            var source = $("#ballot-template").html();
            var template = Handlebars.compile(source);
            $(".ballots .form .form-fields").html(template({"questions" :bjson}));

            $('.ballots').css({'margin-right': 0});
            $('.mainContainer').css({'margin-left': '-' + $(window).outerWidth() + 'px'});

            $('.ballots .closeBtn').on('click', function(){
              $('.ballots').css({  'margin-right':'-100%'});
              $('.mainContainer').css({'margin-left':'0'});
            });
            
          });
        });
      });

      $.getJSON('/elections/complete', function(rjson) {
        var source = $("#result-list-template").html();
        var template = Handlebars.compile(source);
        var results = [];

        $.each(rjson, function (i, r) {
          results.push({
            id: r.id,
            title: r.title,
            date: r.election_date,
          });
        });
        $(".results").html(template({ results: results }));

        if(!results.length) $('.results').hide();
      });


      $('.ballots .form').on('submit', function(e){
        e.preventDefault();

        // makre sure checkbox are checked
        var checkboxQuestions = $('.question').filter(function(k, q){
          return $(q).find('input[type=checkbox]').length > 0;
        });

        checkboxQuestions.each(function(){
          //check at leat 2
          var list = $(this).find('input[type=checkbox]');
          var checked = list.filter(function(k, c){
            return $(c) .is(':checked');
          });
          
          if(checked.length != 2) {
            alert('Please select 2 options for "' + $(this).find('.title').text() + '" ');
          }
        });

        var questionCount = $('.question').length;
        var electionId = $('.form h3.title:eq(0)').attr('data-election');
        var data = $(this).serialize();

        data = data.split('&');

        var groups = [];
        // group same group together
        for (var i = 1; i <= questionCount; i++) {
          var currentGroup = data.filter(function(g, k){
            return g.indexOf('group'+ i) > 0;
          });

          groups.push(currentGroup);
          
        }

        var submitData = {
          user_id: window.user.id,
          election_id: electionId,
          groups:groups
        };

        $.ajax({
          type: "POST",
          url: '/ballots',
          dataType: 'json',
          data: submitData,
          success: function() {
            $('.ballots .closeBtn').trigger('click');
            var $election = $('#election-' + electionId);
            $election.removeClass('active').addClass('inactive');
            $election.find('.active').removeClass('active').addClass('inactive');
          }
        });
      });
    }
  });
})(jQuery);