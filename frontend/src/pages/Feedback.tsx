import { useEffect, useRef, useState } from 'react';
import style from './Feedback.module.css';

export const Feedback: React.FC = () => {
  const nameInputRef = useRef<any>();
  const emailInputRef = useRef<any>();
  const messageInputRef = useRef<any>();

  const [quote, setQuote] = useState<{quote: string, author: string}>();

  useEffect(() => {
    const fetchQuote = async () => {
      const response = await fetch('https://y0sq0ngdi6.execute-api.us-east-1.amazonaws.com/dev/quotes');
      if (response.ok) {
        const data = await response.json();
        const randIndex = Math.floor(Math.random() * data.quotes.length);
        setQuote(data.quotes[randIndex]);
      }
    };

    fetchQuote();
  }, []);

  const handleSubmit = () => {
    const name = nameInputRef.current.value;
    const email = emailInputRef.current.value;
    const message = messageInputRef.current.value;

    const subscribe = async (data: any) => {
      const response = await fetch(
        'https://y0sq0ngdi6.execute-api.us-east-1.amazonaws.com/dev/feedback',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        return await response.json();
    }

    const data = { name, email, message };
    if (name !== '' && email !== '' && message !== '') {
      subscribe(data);
    } else {
      console.log(`please fill ${{name, email, message}}`)
    }
  };

  return (
    <main className={style.container}>
      <h1 className={style.banner}>Welcome to Daily Quotes</h1>
      <section className={style.sample}>
        Daily emails will look like this:
      </section>
      <blockquote className={style.quoteblock}>
        <div className={style.quote}>{quote?.quote}</div>
        <div className={style.author}>by {quote?.author}</div>
      </blockquote>
      <form>
        <div className={style.formGroup}>
          <label>Name:</label>
          <input className={style.formControl} ref={nameInputRef} />
        </div>
        <div className={style.formGroup}>
          <label>Email:</label>
          <input className={style.formControl} ref={emailInputRef} />
        </div>
        <div className={style.formGroup}>
          <label>Message:</label>
          <input className={style.formControl} ref={messageInputRef} />
        </div>
        <div className={style.formGroup}>
          <button className={style.button} type="button" onClick={handleSubmit}>
            Subscribe
          </button>
        </div>
      </form>
    </main>
  );
};
