const Collaborations = () => {
  return (
    <section id="collaborations">
      {/* Collaborations navigation */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Collaborations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-semibold">Facebook</h3>
            <p className="text-gray-600">Collaborate with us on Facebook.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collaborations;