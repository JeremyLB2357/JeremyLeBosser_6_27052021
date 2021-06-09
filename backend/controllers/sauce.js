const Sauce = require('../models/sauce');
const fs = require('fs');

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
    console.log("j'ajoute une sauce !");
    const sauceSended = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        userId: sauceSended.userId,
        name: sauceSended.name,
        manufacturer: sauceSended.manufacturer,
        description: sauceSended.description,
        mainPepper: sauceSended.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`,
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
    console.log('je modifie une sauce !');
    const sauceUpdated = req.files ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceUpdated, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Modifications faites !' }))
        .catch(error => res.status(400).json ({ error }));
    //MAJ de la sauce dans la BDD
};

exports.delete = (req, res, next) => {
    console.log('je supprime une sauce !');
    /*Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch(error => res.status(400).json({ error }));*/
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
    //supprime la sauce de la BDD
};

exports.like = (req, res, next) => {
    console.log(req.body);
    if (req.body.like == 0) {
        console.log('la sauce me laisse indifférent');
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let arrayOfDislikedUsers = sauce.usersDisliked;
                let arrayOfLikedUsers = sauce.usersLiked;
                let numberOfLikes = sauce.likes;
                let numberOfDislikes = sauce.dislikes;
                //->parcourir les tableaux pour supprimer  l'user
                for (let i in arrayOfDislikedUsers) {
                    if (arrayOfDislikedUsers[i] == req.body.userId) {
                        arrayOfDislikedUsers.splice(i, 1);
                        numberOfDislikes = numberOfDislikes - 1;
                    }
                }
                console.log(arrayOfLikedUsers);
                for (let i in arrayOfLikedUsers) {
                    if (arrayOfLikedUsers[i] == req.body.userId) {
                        arrayOfLikedUsers.splice(i, 1);
                        numberOfLikes = numberOfLikes - 1;

                    }
                }
                //->on envoie les données à la BDD
                const arrayTest = [arrayOfLikedUsers, arrayOfDislikedUsers, numberOfLikes, numberOfDislikes];
                console.log(arrayTest);
                Sauce.updateOne(
                    { _id: req.params.id }, 
                    { usersLiked: arrayOfLikedUsers, usersDisliked: arrayOfDislikedUsers, likes: numberOfLikes, dislikes: numberOfDislikes, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Modifications faites !' }))
                    .catch(error => res.status(400).json ({ error }));
            })
            .catch(error => res.status(404).json({ error }));
    }
    if (req.body.like == 1) {
        console.log("j'aime la sauce");
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let isAlreadyDisliked = false;
                for (let i in sauce.usersDisliked) {
                    if (req.body.userId == sauce.usersDisliked[i]) {
                        isAlreadyDisliked = true;
                    }
                }
                if (isAlreadyDisliked) {
                    res.status(405).json({ message: 'impossible de like et dislike' });
                } else {
                    let arrayOfUser = sauce.usersLiked;
                    arrayOfUser.push(req.body.userId);
                    const numberOfLikes = sauce.likes + 1;
                    Sauce.updateOne({ _id: req.params.id }, { usersLiked: arrayOfUser, likes: numberOfLikes, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Modifications faites !' }))
                        .catch(error => res.status(400).json ({ error }));
                }
                
            })
            .catch(error => res.status(404).json({ error }));
    }
    if (req.body.like == -1) {
        console.log("je n'aime pas la sauce");
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                let isAlreadyLiked = false;
                for (let i in sauce.usersLiked) {
                    if (req.body.userId == sauce.usersLiked[i]) {
                        isAlreadyLiked = true;
                    }
                }
                if (isAlreadyLiked) {
                    res.status(405).json({ message: 'impossible de like et dislike' });
                } else {
                    let arrayOfUser = sauce.usersDisliked;
                    arrayOfUser.push(req.body.userId);
                    const numberOfDislikes = sauce.dislikes + 1;
                    Sauce.updateOne({ _id: req.params.id }, { usersDisliked: arrayOfUser, dislikes: numberOfDislikes, _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Modifications faites !' }))
                        .catch(error => res.status(400).json ({ error }));
                }
                
            })
            .catch(error => res.status(404).json({ error }));
    }
    /*on capture l'utilisateur et la sauce
    on cherche dans userslike de la sauce si l'utilsateur est présent
    si oui, on le supprime.
    */
}