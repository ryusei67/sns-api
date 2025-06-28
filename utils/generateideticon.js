const Ideticon = require('identicon.js');

const generateIdetion = (input,size=64)=> {
  //入力されたものをハッシュ化する
  //md5⇨アルゴリズムの名前。どのようにハッシュ化するか。
  const hash = require('crypto').createHash('md5').update(input).digest('hex');
  const data = new Ideticon(hash,size).toString();
  return `data:image/png;base64, ${data}`
}
module.exports = generateIdetion