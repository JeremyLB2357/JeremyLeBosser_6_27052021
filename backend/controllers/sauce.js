const Sauce = require('../models/sauce');

exports.showAll = (req, res, next) => {
    console.log('je cherche toutes les sauces');
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
    //renvoie le tableau de toutes les sauces de la BDD
};

exports.showOne = (req, res, next) => {
    console.log('je cherche une sauce spécifique !');
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
    //renvoie la sauce avec l'ID fourni
};

exports.addOne = (req, res, next) => {
    const sauceSended = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        userId: sauceSended.userId,
        name: sauceSended.name,
        manufacturer: sauceSended.manufacturer,
        description: sauceSended.description,
        mainPepper: sauceSended.mainPepper,
        imageUrl: 'later',
        heat: sauceSended.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisled: []
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error}));
    // après l'avoir analysée
    //capture et enregistre les info de la sauce dans la BDD
    //ajoute 0 like et 0 dislike
};

exports.modifyOne = (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'modification faite !'   
    });
    //MAJ de la sauce dans la BDD
};

exports.deleteOne = (req, res, next) => {
    console.log(req.body);
    res.status(201).json({
        message: 'suppression faite !'   
    });
    //supprime la sauce de la BDD
};