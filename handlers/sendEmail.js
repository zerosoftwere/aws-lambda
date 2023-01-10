const sgMail = require('@sendgrid/mail');
const { response,  internalErrorResponse } = require('./util');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const getSubs = async () => {
  const response = await fetch('https://y0sq0ngdi6.execute-api.us-east-1.amazonaws.com/dev/subcribers');
  if (response.ok) {
    const items = await response.json();
    return items.map(item => item.email);
  }
};

const getRandomQuote = async () => {
  const response = await fetch('https://y0sq0ngdi6.execute-api.us-east-1.amazonaws.com/dev/quotes');
  if (response.ok) {
    const { quotes } = await response.json();
    const randIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randIndex];
  }
};

const createEmailHtml = (quote) => {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html lang="en">
      <body>
        <div
          class="container"
          style="
            min-height: 40vh;
            padding: 0 0.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          ">
          <div class="card" style="margin-left: 20px; margin-right: 20px">
            <div style="font-size: 14px">
              <div
                class="card"
                style="
                  background: #f0c5c5;
                  border-radius: 5px;
                  padding: 1.75rem;
                  font-size: 1.1rem;
                  font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
                    DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New,
                    monospace;
                ">
                <p>${quote.quote}</p>
                <blockquote>by ${quote.author}</blockquote>
              </div>
              <br />
            </div>
            <div class="footer-links" style="display: flex; justify-content: center; align-items: center">
              <a href="/" style="text-decoration: none; margin: 8px; color: #9ca3af">Unsubscribe?</a>
              <a href="/" style="text-decoration: none; margin: 8px; color: #9ca3af">About Us</a>
            </div>
          </div>
        </div>
      </body>
    </html>`;
};

async function sendEmail() {
  const quote = await getRandomQuote();
  const emailHtml = createEmailHtml(quote);
  const subs = await getSubs();

  console.log(subs);
  console.log(quote);

  try {
    const result = await sgMail.sendMultiple({
      to: subs,
      from: 'support@xerosoft.net',
      subject: 'Daily Words of Wisdom',
      text: 'Get Inspired Today',
      html: emailHtml,
    });
    console.log(result);
    return response(200, { message: 'OK' });
  } catch (error) {
    return internalErrorResponse(error);
  }
}

module.exports = sendEmail;