import ContactForm from "@/features/contact/ui/ContactForm";
import { useContactForm } from "@/features/contact/model/useContactForm";

export default function ContactSection() {
  const contact = useContactForm();

  return (
    <div className="w-full">
      {/* HERO */}
      <section
        className="relative h-[55vh] bg-cover bg-center flex items-center justify-center text-white text-center"
      >
        <div className="absolute inset-0 bg-[rgba(10,25,47,0.75)]"></div>

        <div className="relative z-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Contáctanos
          </h2>
          <p className="max-w-xl mx-auto text-lg">
            Estamos disponibles para colaboraciones, consultas académicas y alianzas tecnológicas.
          </p>
        </div>
      </section>

      {/* SECCIÓN */}
      <section className="py-12 px-6 bg-white">
        <div className="flex flex-wrap gap-8 max-w-5xl mx-auto">

          {/* INFO */}
          <div className="flex-1 bg-[#f4f6f8] rounded-xl p-8 shadow-md">
            <h3 className="text-[#0a192f] text-2xl font-bold mb-4">
              Información de contacto
            </h3>

            <p className="text-gray-700 mb-2">
              <strong>Dirección:</strong> Fundación Universitaria de Popayán, Sede Campestre
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Correo institucional:</strong> logiciel@fup.edu.co
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Teléfono:</strong> +57 (2) 820 1234
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Horario:</strong> Lunes a Viernes, 8:00 a.m. - 5:00 p.m.
            </p>
          </div>

          <ContactForm {...contact} />
        </div>
      </section>

      {/* MAPA */}
      <section className="bg-[#eaf3f1] py-12 px-6 text-center">
        <h3 className="text-[#0a192f] text-3xl font-bold mb-6">
          Ubicación
        </h3>

        <div className="max-w-4xl h-[400px] mx-auto rounded-xl overflow-hidden shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.1946659471914!2d-76.61078118865761!3d2.442121857079938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30031a511aaf2b%3A0x9783d5cdff5be8a4!2sFundaci%C3%B3n%20Universitaria%20de%20Popay%C3%A1n%20-%20Claustro%20San%20Jos%C3%A9!5e0!3m2!1ses!2sco!4v1774152001266!5m2!1ses!2sco"
            className="w-full h-full border-0"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </div>
  );
}