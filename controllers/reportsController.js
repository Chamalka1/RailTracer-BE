const Report = require('../models/Reportmodel');


// Create a new report
exports.createReport = async (req, res) => {
  try {
    const newReport = new Report(req.body);
    await newReport.save();
    res.status(201).json({ message: 'Report created successfully', report: newReport });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all reports
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Filter reports by date range
exports.filterReportsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ error: "Start and end dates are required" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setUTCHours(23, 59, 59, 999); // Ensure full end day

    const reports = await Report.find({
      reportDate: { $gte: startDate, $lte: endDate },
    }).sort({ reportDate: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Generate PDF for a single report (data sent from frontend)
exports.generateReportPDF = async (req, res) => {
  try {
    const reportData = req.body;

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=warehouse-report.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Warehouse Daily Report', { align: 'center' });
    doc.moveDown();

    for (const [key, value] of Object.entries(reportData)) {
      doc.fontSize(12).text(`${key}: ${value}`);
    }

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
};
