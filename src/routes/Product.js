import express from 'express';
import fs from 'fs';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

const routerProduct = express.Router();
const readFile = promisify(fs.readFile);
const wFile = promisify(fs.writeFile);

const secretKey = '@2wsx#3edcFdsf';

const app = express();
app.use(express.json());

function validaToken(req, res, next) {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(401).end();
  }
  token = token.replace('Bearer ', '');

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send('aquii').end();
    }
    req.userId = decoded.id;
    next();
  });
}

app.post('/login', (req, res) => {
  const userFile = JSON.parse(await readFile(fileUser, 'utf8'));
  const userFind = userFile.users.find(
    (user) => user.name === req.body.user
  );

  if (req.body.user === userFind.name && req.body.pwd === userFind.pwd) {
    const id = 1;
    const token = jwt.sign({ id }, secretKey, {
      expiresIn: 600,
    });
    res.send({ token });
  } else {
    res.status(401).send({ message: 'Usuário e/ou senha inválidos.' });
  }
});

routerProduct.get('/product', validaToken, async (_, res, next) => {
  try {
    const data = JSON.parse(await readFile(fileProduct, 'utf8'));
    delete data.nextId;
    res.send(data);
    logger.info('Get / Product');
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

routerProduct.get('/product/:id', validaToken, async (req, res, next) => {
  try {
    const data = JSON.parse(await readFile(global.fileProduct, 'utf8'));
    const product = data.products.find(
      (product) => product.id === parseInt(req.paramsid, 10)
    );
    if (product) {
      res.send(product);
    } else {
      res.end();
    }
    logger.info(`Get / Product - ${req.params.id}`);
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

routerProduct.post('/product', validaToken, async (req, res, next) => {
  try {
    let product = req.body;
    const data = JSON.parse(await readFile(global.fileProduct, 'utf8'));
    //console.log(product);
    product = { id: data.nextId++, ...product, timestamp: new Date() };
    data.products.push(product);
    await wFile(global.fileName, JSON.stringify(data));
    //res.send('POST ok');

    res.end();

    logger.info(`POST /product - ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.log('aquii11');
    res.status(400).send({ error: err.message });
  }
  res.status(200); //.send('Tudo ok');
});

routerProduct.post('/product', validaToken, async (req, res, next) => {
  try {
    let product = req.body;
    const data = JSON.parse(await readFile(global.fileProduct, 'utf8'));
    //console.log(product);
    product = { id: data.nextId++, ...product, timestamp: new Date() };
    data.products.push(product);
    await wFile(global.fileName, JSON.stringify(data));
    //res.send('POST ok');

    res.end();

    logger.info(`POST /product - ${JSON.stringify(req.body)}`);
  } catch (err) {
    console.log('aquii11');
    res.status(400).send({ error: err.message });
  }
  res.status(200); //.send('Tudo ok');
});

export default routerProduct;
