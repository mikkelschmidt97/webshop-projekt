import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import styles from "./Contact.module.css";

function Contact() {
  // Sætter korrekt sidetitel og metabeskrivelse (SEO)
  useEffect(() => {
    document.title = "Kontakt – HardwareByen";

    const metaDesc = document.querySelector('meta[name="description"]');
    const content = "Kontakt HardwareByen – vi svarer hurtigt på dine spørgsmål om tech, gaming og ordrer.";

    if (metaDesc) {
      metaDesc.setAttribute("content", content);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, []);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [sent, setSent] = useState(false);

  const onSubmit = () => {
    setSent(true);
    reset();
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <section className={styles.contactSection}>
      <h2>Kontakt os</h2>
      <p>Udfyld formularen, og vi vender hurtigt tilbage!</p>

      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div>
          <input
            {...register("name", { required: true })}
            placeholder="Navn"
            className={styles.input}
          />
          {errors.name && <span className={styles.error}>Udfyld navn</span>}
        </div>

        <div>
          <input
            {...register("surname", { required: true })}
            placeholder="Efternavn"
            className={styles.input}
          />
          {errors.surname && <span className={styles.error}>Udfyld efternavn</span>}
        </div>

        <div>
          <input
            {...register("email", {
              required: true,
              pattern: /^\S+@\S+\.\S+$/,
            })}
            placeholder="Email"
            className={styles.input}
          />
          {errors.email && <span className={styles.error}>Indtast gyldig email</span>}
        </div>

        <div>
          <textarea
            {...register("message", { required: true })}
            placeholder="Din besked"
            className={styles.textarea}
            rows={4}
          />
          {errors.message && <span className={styles.error}>Skriv din besked</span>}
        </div>

        <button type="submit" className={styles.submitBtn}>Send besked</button>
        {sent && <div className={styles.success}>Tak for din besked! Vi vender tilbage hurtigst muligt.</div>}
      </form>
    </section>
  );
}

export default Contact;
