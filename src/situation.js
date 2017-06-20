import express from 'express';
import config from './config.js';
import mysqlConnector from 'mysql';

const router = express.Router();
const mysql = mysqlConnector.createConnection(config.db);
mysql.connect();

const scores = [100, 80, 60, 50, 40, 30, 20, 10, 0];
function getScore(array, action_id) {
  for (var i=0; i<array.length; i++) {
    if (array[i].action_id === action_id) {
      return scores[i];
    }
  }
  return 0;
}

router.get('/', (req, res) => {
  const id = '1';
  const query_situation = `SELECT id, name FROM situation WHERE situation.id=${id}`;
  mysql.query(query_situation, (err, rows) => {
    const situation = rows[0];
    const query_statements = `SELECT step, statement, img FROM situation_statement WHERE situation_id=${id} ORDER BY step`;
    mysql.query(query_statements, (err, rows) => {
      situation.statements = rows;
      const query_actions = `SELECT id, description, img FROM situation_action WHERE situation_id=${id}`;
      mysql.query(query_actions, (err, rows) => {
        situation.actions = rows;
        const query_pov = `SELECT id, description, img FROM situation_pov WHERE situation_id=${id} ORDER BY appearance_order`;
        mysql.query(query_pov, (err, rows) => {
          situation.povs = rows;
          res.send(situation);
        });
      });
    });
  });
  return true;
});

router.post('/answer', (req, res) => {
  if (req.body == undefined || req.body.situation == undefined) {
    res.status(400).send('No parameter: situation');
    return false;
  }
  if (req.body.pov == undefined) {
    res.status(400).send('No parameter: pov');
    return false;
  }
  if (req.body.action == undefined) {
    res.status(400).send('No parameter: action');
    return false;
  }

  const situation_id = req.body.situation;
  const pov_id = req.body.pov;
  const action_id = req.body.action;

  console.log(situation_id, pov_id, action_id);

  const query_answer = `SELECT isCorrect
                        FROM situation_answer
                        WHERE situation_id=${situation_id}
                          AND pov_id=${pov_id}
                          AND action_id=${action_id}`;
  const query_score = `SELECT action_id
                        FROM situation_answer
                        WHERE situation_id=${situation_id}
                          AND pov_id=${pov_id}
                          AND isCorrect=1
                        ORDER BY score`;
  mysql.query(query_answer, (err, rows) => {
    const answer = {
      isCorrect: rows[0].isCorrect ? true : false
    };
    if (rows[0].isCorrect) {
      mysql.query(query_score, (err, rows) => {
        answer.score = getScore(rows, action_id);
        res.send(answer);
      });
    } else {
      answer.score = 0;
      res.send(answer);
    }
  });
  return true;
});

module.exports = router;
