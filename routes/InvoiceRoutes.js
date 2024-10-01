// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const Invoice = require('../dal/models/InvoiceModel'); // Adjust the path as needed

// POST route to add a new invoice
router.post('/addInvoice', async (req, res) => {
    try {
        const invoiceData = req.body;

        // Create new invoice entry
        const newInvoice = await Invoice.create({
            invoice_number: invoiceData.invoice_number,
            invoice_date: invoiceData.invoice_date,
            sub_id: invoiceData.sub_id,
            is_paid: invoiceData.is_paid.toString(), // Ensure it's stored as text
            paid_date: invoiceData.paid_date,
            amount: invoiceData.amount,
            total_tax: invoiceData.total_tax,
            net_payable_amount: invoiceData.net_payable_amount,
            cgst: invoiceData.cgst,
            sgst: invoiceData.sgst,
            igst: invoiceData.igst,
        });

        // Respond with success message and invoice details
        res.json({
            is_success: true,
            message: 'Successfully added invoice',
            details: {
                id: newInvoice.invoice_id,
                description: `Invoice number: ${newInvoice.invoice_number}`,
            },
        });
    } catch (error) {
        console.error('Error adding invoice:', error);
        res.status(500).json({
            is_success: false,
            message: 'Failed to add invoice',
            error: error.message,
        });
    }
});

// GET route to fetch all invoices
router.get('/getInvoices', async (req, res) => {
    try {
        const invoices = await Invoice.findAll();

        res.json({
            is_success: true,
            message: 'Successfully fetched invoices',
            details: invoices.map(invoice => ({
                id: invoice.invoice_id,
                description: `Invoice number: ${invoice.invoice_number}`,
            })),
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            is_success: false,
            message: 'Failed to fetch invoices',
            error: error.message,
        });
    }
});

module.exports = router;
