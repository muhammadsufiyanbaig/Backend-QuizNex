const { createClass, getClassByKey } = require('../models/classModel');

async function createClassHandler(req, res) {
  const { className, uniqueKey } = req.body;
  try {
    await createClass(className, uniqueKey);
    res.json({ message: 'Class created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getClassHandler(req, res) {
  const { key } = req.body;
  try {
    const classData = await getClassByKey(key);
    if (classData.length === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }
    res.json(classData[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  createClassHandler,
  getClassHandler,
};
