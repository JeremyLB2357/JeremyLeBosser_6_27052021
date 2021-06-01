exports.signup = (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'merci de votre inscription'   
    });
    //chiffre le mot de pase
    //ajoute l'utilisateur à la BDD
};

exports.login = (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'vous êtes connecté'
    });
    //vérifie les info de l'utilisateur et renvoie l'identifiant userID depuis la BDD et un jeton Web JSON signé contenant userID
};
