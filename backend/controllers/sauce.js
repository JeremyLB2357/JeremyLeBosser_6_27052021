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
    const sauceSended = JSON.parse(req.body.sauce); //on capture les infos de la sauce
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

    sauce.save()    //on sauvegarde ces infos dans la BDD
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => {
            const imageUrl = sauce.imageUrl.split('/');
            const imageName = imageUrl[imageUrl.length - 1];
            //si il y a une erreur dans la sauvegarde, on supprime le fichier image qui a été stocké
            fs.unlink(`images/${imageName}`, () => {        
                res.status(400).json({ error})
            })
        });
};

exports.modifyOne = (req, res, next) => {
    console.log('je modifie une sauce !');
    //on récupère les infos de la sauce en fonction de la présence ou non d'une image
    const sauceUpdated = req.files ?
        { 
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.files[0].filename}`
        } : { ...req.body };

    //si il n'y a pas d'image, on sauvegarde les modifications de la sauce dans la BDD
    if (!req.files) {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceUpdated, _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Modifications faites !' }))
            .catch(error => res.status(400).json ({ error }));
    } else {
        //si il y a une image, on va chercher les infos originales de la sauce
        Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const imageUrl = sauce.imageUrl.split('/');
            const imageName = imageUrl[imageUrl.length - 1];
            //ensuite on supprime l'image original de la sauce
            fs.unlink(`images/${imageName}`, () => {
                //on sauvegarde  les modifications de la sauce dans la BDD
                Sauce.updateOne({ _id: req.params.id }, { ...sauceUpdated, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Modifications faites !' }))
                    .catch(error => res.status(400).json ({ error }));
            });
        })
        .catch(error => {
            fs.unlink(`images/${req.files[0].filename}`, () => {
                res.status(404).json({ error })
            })
        });
    }
};

exports.delete = (req, res, next) => {
    console.log('je supprime une sauce !');
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(404).json({ error }));
};

exports.like = (req, res, next) => {
    if (req.body.like == 0) {
        console.log('la sauce me laisse indifférent');
        Sauce.findOne({ _id: req.params.id })   //on va chercher les infos de la sauce
            .then(sauce => {
                let arrayOfDislikedUsers = sauce.usersDisliked;
                let arrayOfLikedUsers = sauce.usersLiked;
                let numberOfLikes = sauce.likes;
                let numberOfDislikes = sauce.dislikes;
                //on parcours les tableaux pour supprimer l'user et diminuer le nombre de like ou dislike
                for (let i in arrayOfDislikedUsers) {
                    if (arrayOfDislikedUsers[i] == req.body.userId) {
                        arrayOfDislikedUsers.splice(i, 1);
                        numberOfDislikes = numberOfDislikes - 1;
                    }
                }
                
                for (let i in arrayOfLikedUsers) {
                    if (arrayOfLikedUsers[i] == req.body.userId) {
                        arrayOfLikedUsers.splice(i, 1);
                        numberOfLikes = numberOfLikes - 1;
                    }
                }
                //on envoie les données à la BDD
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
                //on parcours le tableau usersDisliked de la sauce pour savoir si l'user dislike déjà la sauce
                for (let i in sauce.usersDisliked) {
                    if (req.body.userId == sauce.usersDisliked[i]) {
                        isAlreadyDisliked = true;
                    }
                }
                //si c'est le cas, la requête est impossible
                if (isAlreadyDisliked) {
                    res.status(400).json({ message: 'impossible de like et dislike' });
                } else {
                    //sinon on prend le tableau de usersLiked de la sauce, on y ajoute notre user et on sauvegarde dans la BDD
                    //tout en augmentant le nombre de likes
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
                //on parcours le tableau usersLiked de la sauce pour savoir si l'user like déjà la sauce
                for (let i in sauce.usersLiked) {
                    if (req.body.userId == sauce.usersLiked[i]) {
                        isAlreadyLiked = true;
                    }
                }
                //si c'est le cas, la requête est impossible
                if (isAlreadyLiked) {
                    res.status(400).json({ message: 'impossible de like et dislike' });
                } else {
                    //sinon on prend le tableau de usersDisliked de la sauce, on y ajoute notre user et on sauvegarde dans la BDD
                    //tout en augmentant le nombre de dislikes
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
}