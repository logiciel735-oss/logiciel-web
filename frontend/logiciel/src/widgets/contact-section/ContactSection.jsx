import ContactForm from "@/features/contact/ui/ContactForm";
import { useContactForm } from "@/features/contact/model/useContactForm";
import PageHeader from "@/shared/ui/PageHeader";
import SectionHeader from "@/shared/ui/SectionHeader";
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

const INFO = [
  { icon: MapPinIcon, label: "Dirección", value: "Fundación Universitaria de Popayán, Sede Campestre" },
  { icon: EnvelopeIcon, label: "Correo institucional", value: "logiciel@fup.edu.co" },
  { icon: PhoneIcon, label: "Teléfono", value: "+57 (2) 820 1234" },
  { icon: ClockIcon, label: "Horario", value: "Lunes a Viernes, 8:00 a.m. - 5:00 p.m." },
];

export default function ContactSection() {
  const contact = useContactForm();

  return (
    <div className="w-full">
      <PageHeader
        eyebrow="Escríbenos"
        title="Contáctanos"
        description="Estamos disponibles para colaboraciones, consultas académicas y alianzas tecnológicas."
      />

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-5">

          {/* INFORMACIÓN */}
          <aside className="rounded-xl bg-brand-navy p-8 text-white shadow-sm lg:col-span-2">
            <h2 className="text-xl font-semibold">Información de contacto</h2>
            <div className="mt-2 h-1 w-10 rounded-full bg-brand-teal" />

            <ul className="mt-8 space-y-6">
              {INFO.map(({ icon, label, value }) => {
                const Icon = icon;
                return (
                  <li key={label} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-teal-200">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p>
                      <p className="mt-0.5 text-slate-100">{value}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* FORMULARIO */}
          <div className="lg:col-span-3">
            <ContactForm {...contact} />
          </div>
        </div>
      </section>

      {/* MAPA */}
      <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeader eyebrow="Ubicación" title="Claustro San José" />
          <div className="h-[400px] overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.1946659471914!2d-76.61078118865761!3d2.442121857079938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30031a511aaf2b%3A0x9783d5cdff5be8a4!2sFundaci%C3%B3n%20Universitaria%20de%20Popay%C3%A1n%20-%20Claustro%20San%20Jos%C3%A9!5e0!3m2!1ses!2sco!4v1774152001266!5m2!1ses!2sco"
              className="h-full w-full border-0"
              loading="lazy"
              title="Mapa de la Fundación Universitaria de Popayán"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
