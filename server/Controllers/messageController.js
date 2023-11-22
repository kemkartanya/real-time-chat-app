import Message from '../models/message.js';

export const updateMessage = async(req, res) => {
    const id = req.params.id

    try {
        
        const updateMessage = await Event.findByIdAndUpdate(id, {$set: req.body}, {new: true});

        res.status(200).json({success: true, message: 'Successfully updated', data: updateMessage});

    } catch (err) {
        res.status(500).json({success: false, message: 'failed to update', });
    }
};

export const deleteMessage = async(req, res) => {
    const id = req.params.id

    try {
        
        await Message.findByIdAndDelete(id, );

        res.status(200).json({success: true, message: 'Successfully deleted', });

    } catch (err) {
        res.status(500).json({success: false, message: 'failed to delete', });
    }
};

export const getSingleMessage = async(req, res) => {
    const id = req.params.id

    try {       
        const message = await Event.findById(id, );

        res.status(200).json({success: true, message: 'Message found', data: message});

    } catch (err) {
        res.status(404).json({success: false, message: 'No message found', });
    }
};

export const getAllMessage = async(req, res) => {

    try {       
        const messages = await Message.find({});

        res.status(200).json({success: true, message: 'Messages found', data: messages});

    } catch (err) {
        res.status(404).json({success: false, message: 'Not found', err});
    }
};

export const getUserMessage = async(req, res) => {

    const userId = req.params.userId;

    try {
        const userMessage = await Message.find({userId: userId});

        res.status(200).json({success: true, message: 'User Messages found', data: userMessage});

    } catch (err) {
        res.status(404).json({success: false, message: "Not found", });
    }
};

export const createMessage = async (req, res) => {
    const { username, message, } = req.body;

    try {
        // let message = null;

        // event = await Message.findOne({message, username});

        // check if destination exist
        // if(event) {
        //     return res.status(400).json({message: 'Event already exist'})
        // }

        const newMessage = new Message({
            username,
            message,
        });

        await newMessage.save();

        res.status(201).json({ success: true, message: 'Message created successfully', data: newMessage, });   
    } catch (err) {
        res.status(400).json({ success: false, message: 'Failed to create event', error: err.message, });
    }
};