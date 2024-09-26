const xss = require('xss');
const tutorialModel = require('../models/tutorialModel')

// Sanitize the fields before saving them to the database
exports.addNewTutorial = (req, res) => {
    let newTutorial = new tutorialModel({
        tutorial_title: xss(req.body.tutorial_title),
        tutorial_category: xss(req.body.tutorial_category),
        tutorial_about: xss(req.body.tutorial_about),
        tutorial_sections_count: req.body.tutorial_sections_count,
        tutorial_section: xss(req.body.tutorial_section),
        tutorial_exercises: xss(req.body.tutorial_exercises),
        tutorial_estimated_time: xss(req.body.tutorial_estimated_time)
    });

    newTutorial.save().then(() => {
        return res.status(200).json({
            success: 'Tutorial is created successfully'
        });
    }).catch((err) => {
        return res.status(400).json({
            error: err
        });
        console.log(err);
    });
};

exports.getAllTutorials = (req, res) => {
    tutorialModel.find().exec().then((results) => {
        return res.status(200).json({
            success: true,
            tutorials: results
        })
    }).catch((err) => {
        console.error(err)
    })
}

exports.getSelectedTutorial = (req, res) => {
    tutorialModel.findById(req.params.id).exec().then((results) => {
        return res.status(200).json({
            success: true,
            tutorials: results
        })
    }).catch((err) => {
        console.error(err)
    })
}

exports.getSelectedTutorials = (req, res) => {
    const categoryQuery = req.query.category

    tutorialModel.find({ tutorial_category: categoryQuery }).sort({ tutorial_priority: 1 }).then((results) => {
        return res.status(200).json({
            success: true,
            tutorials: results
        })
    }).catch((err) => {
        console.error(err)
    })
}

exports.getSearchedTutorials = (req, res) => {
    const categoryQuery = req.query.category
    const keyQuery = req.query.key
    const regex = new RegExp(keyQuery, 'i')

    tutorialModel.find({ $or: [{ tutorial_title: regex }, { tutorial_category: categoryQuery }] }).sort({ tutorial_priority: 1 }).then((results) => {
        return res.status(200).json({
            success: true,
            tutorials: results
        })
    }).catch((err) => {
        console.error(err)
    })
}

// Sanitize the fields before saving them to the database
exports.updateTutorial = (req, res) => {
    const id = req.params.id;
    const tutorial_title = xss(req.body.tutorial_title);
    const tutorial_category = xss(req.body.tutorial_category);
    const tutorial_about = xss(req.body.tutorial_about);
    const tutorial_sections_count = req.body.tutorial_sections_count;
    const tutorial_section = xss(req.body.tutorial_section);
    const tutorial_exercises = xss(req.body.tutorial_exercises);
    const tutorial_estimated_time = xss(req.body.tutorial_estimated_time);

    tutorialModel.findByIdAndUpdate(id, {
        tutorial_title,
        tutorial_category,
        tutorial_about,
        tutorial_sections_count,
        tutorial_section,
        tutorial_exercises,
        tutorial_estimated_time
    }, { new: true }).then(() => {
        res.send("successfully updated");
    }).catch((err) => {
        return res.status(500).send('Error occurred');
    });
};

// Generic Error Message
exports.deleteTutorial = (req, res) => {
    tutorialModel.findByIdAndDelete(xss(req.params.id)).then(() => {
        return res.status(200).json({
            success: true,
        });
    }).catch((err) => {
        console.error(xss(err.message)); // Log the error safely for debugging purposes
        return res.status(500).json({
            error: 'An error occurred while deleting the tutorial' // Send a generic error message
        });
    });
};

// Sanitize the review input
exports.addReview = async(req, res) => {
    const { documentId, newReview } = req.body;

    try {
        const document = await tutorialModel.findById(documentId);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Sanitize the review
        document.tutorial_reviews.push(xss(newReview));

        await document.save();
        return res.status(200).json({ success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};