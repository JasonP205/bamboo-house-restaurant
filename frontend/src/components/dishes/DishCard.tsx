const DishCard = () => {
  return (
    <div className="group relative bg-surface rounded-xl overflow-hidden hover:translate-y-[-4px] transition-all duration-300">
      <div className="aspect-[4/5] overflow-hidden relative">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          data-alt="overhead shot of a vibrant green heirloom tomato tart with delicate basil microgreens and edible white flowers on a textured ceramic plate"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRRChHomNKI4AmRsACc_Xb49qGhUTc192s4ILaS9QTOiG09fPUPs3bDGmc-vNNztqDbs9gdxBG4qt_zMz6eHbUxmGPwoWdGAACcFCaYUQvdi2ZyJ1FgP4zHwv2BIpiXXo4HwH70u1vhW4SdZK79_QdwV6NBSoWa7uFT0CtbgXfT7AqSJjUSx5DxyU31151lwqLW5v4mYkvihBdBJvlW7oAnT_SlXftoYraZ9kBh02IWJSDfkrHUHhBoUGcGN3A-ihBRVpqBVJrQnw"
        />
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-primary uppercase tracking-tighter">
            Popular
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-serif text-xl italic text-on-surface">
            Forest Floor Carpaccio
          </h3>
          <span className="font-body font-bold text-primary">$24</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed opacity-70 mb-6">
          Wild foraged chanterelles, pine nut emulsion, truffle-infused moss,
          and crispy lichen shards.
        </p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Active
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input className="sr-only peer" type="checkbox" />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
