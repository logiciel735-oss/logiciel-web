import { Link } from "react-router-dom";

const PurposeSection = () => {
  return (
    <section className="text-center py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl text-[#0a192f] font-bold mb-6">
          Nuestro propósito
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-10">
          Somos un grupo de investigación enfocado en promover el
          avance científico y tecnológico, mediante proyectos
          innovadores que generan impacto académico y social en la región.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center bg-[#0a192f] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#64ffda] hover:text-[#0a192f] transition-all"
        >
          Explorar proyectos
        </Link>
      </div>
    </section>
  );
};

export default PurposeSection;