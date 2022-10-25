const DbCad = require('../model/User');
const brcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.home = (req, res) => {
    res.json({message: 'conectando a api'});
}

//get values of body

exports.auth = async (req, res) => {
    const {name, email, pass, confpass} = req.body;

    //validation of values

    if(!name){
        res.status(422).json({msg: "O nome e obrigatorio!"});
        return
    }
    if(!email){
        res.status(422).json({msg: "O email e obrigatorio!"});
        return
    }
    if(!pass){
        res.status(422).json({msg: "O senha e obrigatorio!"});
        return
    }
    if(pass !== confpass){
        res.status(422).json({msg: "As senhas não conferem!"});
        return
    }

    //verificando se ha email repitido "importante"

    const userExists = await DbCad.findOne({email: email});

    if(userExists){
        res.status(422).json({msg: "email ja cadastrado, utilize outro email"});
        return
    }

    //melhorando a segurança da senha "importante"

    const salt = await brcrypt.genSalt(12);
    const passHash = await brcrypt.hash(pass, salt);

    //indexando os valores em variaveis para serem enviados ao banco de dados 

    const user = { 
        name, 
        email, 
        pass: passHash, //passando a senha com segurança
    }

    //alimentando o banco de dados 

    try {
        await DbCad.create(user);
        res.status(201).json({message: 'usuario cadastrado com sucesso'});
    } catch (error) {
        res.status(500).json({error: error});
    }
}

exports.login = async (req, res) => {

    const {email, pass} = req.body;

    if(!email){
        res.status(422).json({msg: "O email e obrigatorio!"});
        return
    }
    if(!pass){
        res.status(422).json({msg: "O senha e obrigatorio!"});
        return
    }

    //chegando se o usuario existe

    const user = await DbCad.findOne({email: email});

    if(!user){
        res.status(404).json({msg: "Usuario não encontrado"});
        return
    }

    //chegando se a senha ja foi cadastrada

    const checkpass = await brcrypt.compare(pass, user.pass);

    if(!checkpass){
        res.status(422).json({msg: "senha invalida"});
        return
    }

    try {

        const secret = process.env.SECRET
        const token = jwt.sign(
            {
                id: user._id,
            },secret,
        )
        res.status(200).json({msg: "dados validados com sucesso", token})
    } catch (error) {
        res.status(500).json({error: error});
    }
}

//filtrando usuario
exports.priv = async (req, res) => {
    const id = req.params.id;

    //checando se u usuario existe e passando os valores cadastrados sem a senha 
    const user = await DbCad.findById(id, '-pass');

    if(!user){
        res.status(404).json({message: "usuario não encontrado"});
        return
    }

    res.status(200).json({user});
}


