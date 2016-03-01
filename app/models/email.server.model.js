'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    EmailTemplate = require('./email.template'),
    Schema = mongoose.Schema,
    Q = require('q'),
    _ = require('lodash');

/**
 * Email Schema
 */
var EmailSchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Email name',
        trim: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    /*user: {
        type: Schema.ObjectId,
        ref: 'User'
    },*/
    config: {
        type: Object,
        default: {},
        required: 'E-mail must be configured!'
    },
    sent: {
        type: Array,
        default: []
    }
});


EmailSchema.methods.generateEmail = function (callback) {

};

/**
 * Updates Email Document's Sent list
 * @param recipients
 * @returns {*|promise}
 */
EmailSchema.methods.updateSent = function (recipients) {
    var deferred = Q.defer();

    var sent = this.sent || [];

    recipients.forEach(function (rec) {
        sent.push(rec);
    });

    this.sent = sent;

    this.save(function(err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
};

EmailSchema.methods.sendTestEmail = function (transporter, mailOptions, callback) {
    if (!transporter) {
        return;
    }

    var newOptsObj = _.extend({}, mailOptions),
        options = _.extend(newOptsObj, {
            from: '"Ulesta Test Bed!" <ulestatestbest@gmail.com>', // sender address,
            subject: this.config.subject,
            html: _constructEmailFromTemplate(this.config)
        });

    transporter.sendMail(options, callback);
};

EmailSchema.statics.sendTestEmail = function (transporter, mailOptions, callback) {
    if (!transporter) {
       return;
    }

    /*var email = {
        config: {
            subject: "New Sales!",
            storeName: "Gold Shop",
            mainHeading: "Save up to 20%",
            mainImg: "http://s3.amazonaws.com/swu-filepicker/9wRy50HQTg2CTyZA5Ozi_item_images_16.jpg",
            mainParagraph: "Today only flash sale!",
            mainBtnEnabled: true,
            mainBtnText: "View now!",
            mainBtnLink: "http://google.ca",
            subHeading: "Look out for awesome deals!",
            blocks: [{
                imgEnabled: true,
                imgUrl: "http://s3.amazonaws.com/swu-filepicker/9wRy50HQTg2CTyZA5Ozi_item_images_16.jpg",
                heading: "Pink Shoes",
                tag: "$29.99",
                content: "The quick brown fox jumps over the lazy dog",
                btnEnabled: true,
                btnText: "View now!",
                btnLink: ""
            }],
            footer: "Some text"
        }
    };
*/
    var newOptsObj = _.extend({}, mailOptions),
        options = _.extend(newOptsObj, {
            from: '"Ulesta Test Bed!" <ulestatestbest@gmail.com>', // sender address,
            subject: email.config.subject,
            html: _constructEmailFromTemplate(email.config)
        });

    transporter.sendMail(options, callback);
};

/**
 * Generates HTML from Block content
 * @param blocks
 * @returns {string}
 * @private
 */
function _generateBlockHtml(blocks) {
    var blocksHtml = "";
    blocks.forEach(function (block) {
        var blockTemplate = EmailTemplate.block;

        // Insert image
        if (block.imgEnabled) {
            var blockImgTemplate = EmailTemplate.blockImg;
            blockImgTemplate = blockImgTemplate.replace(/\{\{imgUrl\}\}/g, block.imgUrl);

            blockTemplate = blockTemplate.replace(/\{\{img\}\}/g, blockImgTemplate);
        } else {
            blockTemplate = blockTemplate.replace(/\{\{img\}\}/g, "");
        }

        // Insert btn
        if (block.btnEnabled) {
            var blockBtnTemplate = EmailTemplate.blockBtn;
            blockBtnTemplate = blockBtnTemplate.replace(/\{\{btnText\}\}/g, block.btnText);
            blockBtnTemplate = blockBtnTemplate.replace(/\{\{btnLink\}\}/g, block.btnLink);

            blockTemplate = blockTemplate.replace(/\{\{btn\}\}/g, blockBtnTemplate);
        } else {
            blocksHtml = blocksHtml.replace(/\{\{btn\}\}/g, "");
        }

        // Insert Content
        blockTemplate = blockTemplate.replace(/\{\{heading\}\}/g, block.heading);
        blockTemplate = blockTemplate.replace(/\{\{tag\}\}/g, block.tag);
        blockTemplate = blockTemplate.replace(/\{\{content\}\}/g, block.content);

        blocksHtml += blockTemplate;
    });
    return blocksHtml;
}

/**
 * Constructs and Email based on Email's configurations
 * @param config
 * @returns {*|string}
 * @private
 */
function _constructEmailFromTemplate(config) {
    var template = EmailTemplate.main;

    // Insert Store Name
    template = template.replace(/\{\{storeName\}\}/g, config.storeName);
    // Insert Img if specified
    template = template.replace(/\{\{mainImg\}\}/g, config.mainImg);
    // Insert Heading
    template = template.replace(/\{\{mainHeading\}\}/g, config.mainHeading);
    // Insert Heading Content (Paragraph)
    template = template.replace(/\{\{mainParagraph\}\}/g, config.mainParagraph);
    // Insert Button
    if (config.mainBtnEnabled) {
        var btnTemplate = EmailTemplate.mainBtn;
        btnTemplate = btnTemplate.replace(/\{\{mainBtnText\}\}/g, config.mainBtnText);
        btnTemplate = btnTemplate.replace(/\{\{mainBtnLink\}\}/g, config.mainBtnLink);

        template = template.replace(/\{\{mainBtn\}\}/g, btnTemplate);
    } else {
        template = template.replace(/\{\{mainBtn\}\}/g, "");
    }

    // Insert Subheading
    template = template.replace(/\{\{subHeading\}\}/g, config.subHeading);

    // Insert Blocks
    var blocks = _generateBlockHtml(config.blocks);
    template = template.replace(/\{\{blocks\}\}/g, blocks);

    // Insert Footer
    template = template.replace(/\{\{footer\}\}/g, config.footer);

    return template;
}


mongoose.model('Email', EmailSchema);
