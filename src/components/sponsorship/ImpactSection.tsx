
const ImpactSection = () => {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-playfair text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Making a Real Impact
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-ibm-plex">
            See how churches are already transforming their communities with Gospool
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-brand-blue mb-2 font-poppins">85%</div>
            <p className="text-gray-600 dark:text-gray-300 font-ibm-plex">Increase in church attendance</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-brand-green mb-2 font-poppins">12K+</div>
            <p className="text-gray-600 dark:text-gray-300 font-ibm-plex">Rides shared monthly</p>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-brand-purple mb-2 font-poppins">450+</div>
            <p className="text-gray-600 dark:text-gray-300 font-ibm-plex">Partner churches</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
