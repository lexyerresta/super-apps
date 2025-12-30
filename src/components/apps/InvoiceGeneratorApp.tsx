'use client';

import React, { useState, useRef } from 'react';
import styles from './MiniApps.module.css';
import { FileText, Plus, Trash2, Download, Building2, User, Calendar, DollarSign, Printer } from 'lucide-react';

interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
}

interface InvoiceData {
    invoiceNumber: string;
    date: string;
    dueDate: string;
    fromName: string;
    fromAddress: string;
    fromEmail: string;
    toName: string;
    toAddress: string;
    toEmail: string;
    items: InvoiceItem[];
    notes: string;
    taxRate: number;
}

export default function InvoiceGeneratorApp() {
    const [invoice, setInvoice] = useState<InvoiceData>({
        invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        fromName: '',
        fromAddress: '',
        fromEmail: '',
        toName: '',
        toAddress: '',
        toEmail: '',
        items: [{ id: '1', description: '', quantity: 1, price: 0 }],
        notes: '',
        taxRate: 10,
    });

    const [showPreview, setShowPreview] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { id: Date.now().toString(), description: '', quantity: 1, price: 0 }],
        });
    };

    const removeItem = (id: string) => {
        if (invoice.items.length > 1) {
            setInvoice({
                ...invoice,
                items: invoice.items.filter((item) => item.id !== id),
            });
        }
    };

    const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
        setInvoice({
            ...invoice,
            items: invoice.items.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        });
    };

    const subtotal = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    const tax = subtotal * (invoice.taxRate / 100);
    const total = subtotal + tax;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice ${invoice.invoiceNumber}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; background: white; color: #1a1a2e; }
                    .invoice { max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
                    .title { font-size: 32px; font-weight: 700; color: #6366f1; }
                    .invoice-info { text-align: right; }
                    .invoice-info p { margin: 4px 0; color: #666; }
                    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .party h3 { color: #6366f1; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                    .party p { margin: 4px 0; color: #444; }
                    .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .items-table th { background: #6366f1; color: white; padding: 12px; text-align: left; font-weight: 600; }
                    .items-table th:last-child, .items-table td:last-child { text-align: right; }
                    .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
                    .totals { margin-left: auto; width: 300px; }
                    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
                    .totals-row.total { font-weight: 700; font-size: 18px; color: #6366f1; border-bottom: none; border-top: 2px solid #6366f1; margin-top: 8px; padding-top: 12px; }
                    .notes { margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                    .notes h4 { color: #6366f1; margin-bottom: 8px; }
                </style>
            </head>
            <body>
                <div class="invoice">
                    <div class="header">
                        <div class="title">INVOICE</div>
                        <div class="invoice-info">
                            <p><strong>${invoice.invoiceNumber}</strong></p>
                            <p>Date: ${invoice.date}</p>
                            <p>Due: ${invoice.dueDate}</p>
                        </div>
                    </div>
                    <div class="parties">
                        <div class="party">
                            <h3>From</h3>
                            <p><strong>${invoice.fromName || 'Your Company'}</strong></p>
                            <p>${invoice.fromAddress || 'Address'}</p>
                            <p>${invoice.fromEmail || 'email@example.com'}</p>
                        </div>
                        <div class="party">
                            <h3>Bill To</h3>
                            <p><strong>${invoice.toName || 'Client Name'}</strong></p>
                            <p>${invoice.toAddress || 'Address'}</p>
                            <p>${invoice.toEmail || 'client@example.com'}</p>
                        </div>
                    </div>
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${invoice.items.map(item => `
                                <tr>
                                    <td>${item.description || 'Item'}</td>
                                    <td>${item.quantity}</td>
                                    <td>${formatCurrency(item.price)}</td>
                                    <td>${formatCurrency(item.quantity * item.price)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="totals">
                        <div class="totals-row">
                            <span>Subtotal</span>
                            <span>${formatCurrency(subtotal)}</span>
                        </div>
                        <div class="totals-row">
                            <span>Tax (${invoice.taxRate}%)</span>
                            <span>${formatCurrency(tax)}</span>
                        </div>
                        <div class="totals-row total">
                            <span>Total</span>
                            <span>${formatCurrency(total)}</span>
                        </div>
                    </div>
                    ${invoice.notes ? `
                        <div class="notes">
                            <h4>Notes</h4>
                            <p>${invoice.notes}</p>
                        </div>
                    ` : ''}
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className={styles.appContainer}>
            <div className={styles.appHeader}>
                <div className={styles.appIconWrapper} style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <FileText size={24} />
                </div>
                <div>
                    <h2>Invoice Generator</h2>
                    <p>Create professional invoices</p>
                </div>
            </div>

            <div className={styles.invoiceGenerator}>
                {/* Invoice Number and Dates */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <Calendar size={18} /> Invoice Details
                    </h3>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Invoice Number</label>
                            <input
                                type="text"
                                value={invoice.invoiceNumber}
                                onChange={(e) => setInvoice({ ...invoice, invoiceNumber: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Date</label>
                            <input
                                type="date"
                                value={invoice.date}
                                onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Due Date</label>
                            <input
                                type="date"
                                value={invoice.dueDate}
                                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* From Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <Building2 size={18} /> From (Your Details)
                    </h3>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Name / Company</label>
                            <input
                                type="text"
                                value={invoice.fromName}
                                onChange={(e) => setInvoice({ ...invoice, fromName: e.target.value })}
                                placeholder="Your Company Name"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                value={invoice.fromAddress}
                                onChange={(e) => setInvoice({ ...invoice, fromAddress: e.target.value })}
                                placeholder="123 Main St, City"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={invoice.fromEmail}
                                onChange={(e) => setInvoice({ ...invoice, fromEmail: e.target.value })}
                                placeholder="you@example.com"
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* To Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <User size={18} /> Bill To (Client Details)
                    </h3>
                    <div className={styles.formGrid3}>
                        <div className={styles.formGroup}>
                            <label>Name / Company</label>
                            <input
                                type="text"
                                value={invoice.toName}
                                onChange={(e) => setInvoice({ ...invoice, toName: e.target.value })}
                                placeholder="Client Name"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Address</label>
                            <input
                                type="text"
                                value={invoice.toAddress}
                                onChange={(e) => setInvoice({ ...invoice, toAddress: e.target.value })}
                                placeholder="456 Oak Ave, Town"
                                className={styles.input}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input
                                type="email"
                                value={invoice.toEmail}
                                onChange={(e) => setInvoice({ ...invoice, toEmail: e.target.value })}
                                placeholder="client@example.com"
                                className={styles.input}
                            />
                        </div>
                    </div>
                </div>

                {/* Items Section */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>
                        <DollarSign size={18} /> Items
                    </h3>
                    <div className={styles.invoiceItems}>
                        <div className={styles.invoiceItemsHeader}>
                            <span style={{ flex: 3 }}>Description</span>
                            <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
                            <span style={{ flex: 1, textAlign: 'center' }}>Price</span>
                            <span style={{ flex: 1, textAlign: 'right' }}>Amount</span>
                            <span style={{ width: 40 }}></span>
                        </div>
                        {invoice.items.map((item) => (
                            <div key={item.id} className={styles.invoiceItemRow}>
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                    placeholder="Item description"
                                    className={styles.input}
                                    style={{ flex: 3 }}
                                />
                                <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                    min="1"
                                    className={styles.input}
                                    style={{ flex: 1, textAlign: 'center' }}
                                />
                                <input
                                    type="number"
                                    value={item.price}
                                    onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                    min="0"
                                    step="0.01"
                                    className={styles.input}
                                    style={{ flex: 1, textAlign: 'center' }}
                                />
                                <span className={styles.itemAmount} style={{ flex: 1, textAlign: 'right' }}>
                                    {formatCurrency(item.quantity * item.price)}
                                </span>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className={styles.iconButton}
                                    disabled={invoice.items.length === 1}
                                    style={{ opacity: invoice.items.length === 1 ? 0.5 : 1 }}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        <button onClick={addItem} className={styles.addItemButton}>
                            <Plus size={18} /> Add Item
                        </button>
                    </div>
                </div>

                {/* Totals */}
                <div className={styles.invoiceTotals}>
                    <div className={styles.totalRow}>
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className={styles.totalRow}>
                        <span>
                            Tax
                            <input
                                type="number"
                                value={invoice.taxRate}
                                onChange={(e) => setInvoice({ ...invoice, taxRate: parseFloat(e.target.value) || 0 })}
                                min="0"
                                max="100"
                                className={styles.taxInput}
                            />
                            %
                        </span>
                        <span>{formatCurrency(tax)}</span>
                    </div>
                    <div className={`${styles.totalRow} ${styles.grandTotal}`}>
                        <span>Total</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>

                {/* Notes */}
                <div className={styles.formSection}>
                    <div className={styles.formGroup}>
                        <label>Notes / Terms</label>
                        <textarea
                            value={invoice.notes}
                            onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                            placeholder="Payment terms, bank details, thank you message..."
                            rows={3}
                            className={styles.textarea}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.buttonGroup}>
                    <button onClick={handlePrint} className={styles.primaryButton}>
                        <Printer size={18} /> Print Invoice
                    </button>
                </div>
            </div>

            <div ref={printRef} style={{ display: 'none' }} />
        </div>
    );
}
