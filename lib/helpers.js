const crypto = require('crypto');

module.exports = {
  encrypPassword: (email, password) => {

    var hash = crypto.createHmac('sha256', password)
      .update(':' + email)
      .digest('hex');

    return hash;
  },

  checkPin: (pin) => {
    for (let i = 2; i < pin; i++) {
      if (pin % i === 0) {
        return false;
      }
    }
    return pin > 1;
  },

  getCurrentDate: () => {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    return mm + '-' + dd + '-' + yyyy;
  },

  parseAnswers: (data) => {
    let ballotId = 0;
    let answers = [];

    const keys = Object.keys(data);
    keys.forEach((key) => {
      if (/groups\[.*/.test(key)) {
        let answer = {
          user_id: data.user_id,
          election_id: data.election_id,
          ballot_id: ballotId++,
        };

        const options = data[key];
        if (typeof options === 'string') {
          answer.result = /.*=on/.test(options);
        }
        else if (Array.isArray(options)) {
          answer.result = [];
          options.forEach((option) => {
            const m = option.match(/option(\d+)-group(\d+)-(.*?)=(.*)/);

            const optionId = parseInt(m[1], 10);
            const groupId = parseInt(m[2], 10);
            const T = m[3];
            const value = m[4];

            if (T === 'type1') {
              const result = parseInt(value, 10) || null;
              if (result != null) {
                answer.result[optionId] = {
                  option_id: optionId,
                  result:result
                };
              }
            }
            else if (T === 'type3') {
              if(value === 'on') {
                answer.result[optionId] =  {
                  option_id: optionId,
                  result: value
                };
              }

            }
            else if (T === 'type2') {
              if(value === 'on') {
                answer.result[optionId] =  {
                  option_id: optionId,
                  result: true
                };
              }
            }
            else {
            }
          });
        }

        answers.push(answer);
      }
    });

    return answers;
  }
}