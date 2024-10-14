const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to the simple Express server!');
});

app.get('/pdf', async (req, res) => {
  try {
    const invoiceData = {
      title: 'Invoice',
      header: 'Invoice #12345',
      body: 'This is a dynamically generated invoice.',
      items: [
        { description: 'Product A', quantity: 2, unitPrice: 50.0 },
        { description: 'Product B', quantity: 1, unitPrice: 75.0 },
        { description: 'Product C', quantity: 3, unitPrice: 30.0 },
        { description: 'Product D', quantity: 1, unitPrice: 120.0 },
        { description: 'Product E', quantity: 4, unitPrice: 20.0 },
        { description: 'Product F', quantity: 2, unitPrice: 45.0 },
        { description: 'Product G', quantity: 5, unitPrice: 15.0 },
        { description: 'Product H', quantity: 3, unitPrice: 60.0 },
        { description: 'Product I', quantity: 1, unitPrice: 100.0 },
        { description: 'Product J', quantity: 6, unitPrice: 25.0 },
        { description: 'Product K', quantity: 2, unitPrice: 80.0 },
        { description: 'Product L', quantity: 3, unitPrice: 35.0 },
        { description: 'Product M', quantity: 4, unitPrice: 40.0 },
        { description: 'Product N', quantity: 1, unitPrice: 90.0 },
        { description: 'Product O', quantity: 2, unitPrice: 55.0 },
        { description: 'Product P', quantity: 5, unitPrice: 10.0 },
        { description: 'Product Q', quantity: 3, unitPrice: 70.0 },
        { description: 'Product R', quantity: 1, unitPrice: 110.0 },
        { description: 'Product S', quantity: 4, unitPrice: 50.0 },
        { description: 'Product T', quantity: 2, unitPrice: 65.0 },
        { description: 'Product U', quantity: 3, unitPrice: 20.0 },
        { description: 'Product V', quantity: 1, unitPrice: 85.0 },
        { description: 'Product W', quantity: 6, unitPrice: 30.0 },
        { description: 'Product X', quantity: 2, unitPrice: 95.0 },
        { description: 'Product Y', quantity: 3, unitPrice: 25.0 },
        { description: 'Product Z', quantity: 1, unitPrice: 130.0 },
      ],
      imageUrls: [
        'https://inme-digital-services-road-side-care--thumbnail.s3-accelerate.amazonaws.com/Prod/hnb/172867396233405bbf67b/CUS_VEHILE_PHOTO/rn_image_picker_lib_temp_a51a1fd5-c031-4335-84fe-c2e434b2e943_1728679307482.jpg?AWSAccessKeyId=AKIAXBJZF3MSOHLB6VVG&Expires=1728689098&Signature=zyoN7WEQwEINpPg4lp4UFfQOXpc%3D',
        'https://inme-digital-services-road-side-care--thumbnail.s3-accelerate.amazonaws.com/Prod/hnb/172867396233405bbf67b/CUS_VEHILE_PHOTO/rn_image_picker_lib_temp_cb2e67aa-e8dc-4e42-94a7-3e4e9b04269c_1728679304402.jpg?AWSAccessKeyId=AKIAXBJZF3MSOHLB6VVG&Expires=1728689098&Signature=18WrDBpx6t8Lxo0iRxMGUD7%2FIKA%3D',
        'https://inme-digital-services-road-side-care--thumbnail.s3-accelerate.amazonaws.com/Prod/hnb/172867396233405bbf67b/CUS_VEHILE_PHOTO/rn_image_picker_lib_temp_8cf67475-55ab-488f-9aed-970af93bfc66_1728679301842.jpg?AWSAccessKeyId=AKIAXBJZF3MSOHLB6VVG&Expires=1728689098&Signature=hcEnROu8qY2%2BErrxNdK%2F1yzx6DA%3D',
      ],
    };

    const htmlContent = await ejs.renderFile(path.join(__dirname, 'views', 'template.ejs'), invoiceData);

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      headerTemplate: `
        <style>#header, #footer { padding: 0 !important; }</style>
        <div style="font-size: 10px; text-align: center; width: 100%; padding: 10px 0; height: 40px; background-color: #5046e6; color: white; -webkit-print-color-adjust: exact;">
          <span>Invoice - Invoice #12345 - Date: ${new Date().toLocaleDateString()} - Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>`,
      footerTemplate: `
        <style>#header, #footer { padding: 0 !important; }</style>
        <div style="font-size: 10px; text-align: right; width: 100%; height: 40px; padding: 10px; background-color: #5046e6; color: white; -webkit-print-color-adjust: exact;">
          Page <span class="pageNumber"></span> of <span class="totalPages"></span>
        </div>`,
      margin: {
        top: '100px',
        bottom: '100px',
        left: '40px',
        right: '40px',
      },
    });
    await browser.close();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="invoice.pdf"',
    });
    res.end(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
