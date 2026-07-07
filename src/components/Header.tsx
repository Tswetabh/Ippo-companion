export default function Header() {
  return (
    <header className="flex justify-between items-center h-16 px-margin-desktop sticky top-0 z-45 bg-surface/70 backdrop-blur-md bg-opacity-70">
      {/* Search */}
      <div className="relative w-96 max-w-md hidden md:block">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
          search
        </span>
        <input
          className="w-full bg-surface-container-low border border-outline-variant rounded-xl py-2 pl-10 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          placeholder="Search classes, assignments, or notes... (Cmd+K)"
          type="text"
        />
      </div>
      <div className="md:hidden">
        <h1 className="font-title-md text-title-md text-primary font-bold">CampusFlow</h1>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <span className="material-symbols-outlined">bolt</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <img
          alt="User profile"
          className="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-primary hover:ring-offset-2 transition-all md:hidden"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIIgONthR8z8hKToxYl7dhG9eEAHU2_Qu-GIM5GmMjIVdlHKXf8HE7FXpeekVR4SWG35ScZqrTksnJVE0SKuEqxpM8i88fgtxR70r4GUKlhKUI1PSy5qTOgXCPt16DFyAlD6vqRCriUkgxGIp_IZsCXqW35wadWOhMHmXtoTpIlZvLFzKBx9bC_ASXfRUVhpVsbs97Nm_1Ombkg0eYzsi19WXbZQSrKmgDBoY9fCI16syIKkWXv4bcFKIqeopn14AjCTE8laS3_Mc"
        />
      </div>
    </header>
  );
}
