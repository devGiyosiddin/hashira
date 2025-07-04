import Sidebar from "../../components/SideBar/SideBar";
const Leaderboard = () => {
  return (
    <div className="flex gap-4">
          <Sidebar />
          <div className="flex flex-col p-4">
            <div className="flex flex-col p-4">
                <h2 className="text-4xl font-bold text-center mb-8">Yetakchilar taxtasi</h2>
                <span className="text-xl font-semibold">Top onlaynlar</span>  
            </div>
              <div className="flex gap-2">
                  {/* Leaderboard buttons */}
                  <button className="mb-2 cursor-pointer d-block font-bold fw-bold py-3 px-4 rounded-full"
                      style={{
                        "backgroundColor": 'var(--button-bg)'
                    }}
                  >
                    <span>Shu kungacha</span>
                </button>
                  <button className="mb-2 cursor-pointer d-block font-bold fw-bold py-3 px-4 rounded-full"
                    style={{
                        "backgroundColor": 'var(--button-bg)'
                    }}
                  >
                    <span>Shu xaftagacha</span>
                </button>
            </div>
          </div>
      {/* Placeholder for leaderboard content */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Leaderboard content will be here.</div>
      </div>
    </div>
  );
}
export default Leaderboard;