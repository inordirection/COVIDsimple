const db = require('../database');

class Articles {
  static retrieveAll (callback) {
    let text = 'SELECT * FROM articles';
    db.query(text, (err, res) => {
      if (err.error){
        console.log(err.error);
        return callback(err.error);
      }
      callback(res);
    });
  }

  static insert (article, callback) {
    let query_string = `INSERT INTO articles (name, url, source, date, rating_sum, rating_count) VALUES ($1, $2, $3, $4, $5, $6)\
                       ON CONFLICT (url) DO UPDATE SET rating_sum= articles.rating_sum + $5, rating_count= articles.rating_count + 1`;
    let name = article.name;
    let url = article.url;
    let source = article.source;
    let date = article.date;
    let rating = article.rating;
    let count = 1;

    db.query(query_string, [name, url, source, date, rating, count], (err, res) => {
          if (err.error)
            return callback(err);
          callback(res);
        });
  }

  static deleteArticle (url, callback) {
    let query_string = `DELETE FROM articles WHERE url= $1`;
    let key = url;
    db.query(query_string, [key], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  static exists (url, callback) {
    let query_string = `SELECT EXISTS(SELECT 1 from articles where url=$1)`;
    let key = url;
    db.query(query_string, [key], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }

  /* only updates rating fields, will not update any other fields at this time */
  static update (article, callback) {
    let query_string = `UPDATE articles SET rating_sum = rating_sum + $2, rating_count = rating_count+1 WHERE url=$1`;
    let url = article.url;
    let rating = article.rating;
    db.query(query_string, [url, rating], (err, res) => {
      if (err.error)
        return callback(err);
      callback(res);
    });
  }
}

module.exports = Articles;