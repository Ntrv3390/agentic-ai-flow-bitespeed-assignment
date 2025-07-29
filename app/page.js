import Header from "@/app/components/Header";
import SelectableNode from "./components/SelectableNode";
import Canvas from "./components/Canvas";
import SelectableNodeList from "./components/SelectableNodeList";

export default function Home() {
  return (
    <div className="h-screen flex flex-col">
      <div className="bg-[#f3f3f3] w-full h-[7vh] relative shadow-lg">
        <Header />
      </div>
      <div className="flex flex-grow">
        <div className="w-[75%] h-full"><Canvas /></div>
        <div className="w-[3px] h-full shadow-md bg-[#f3f3f3]" />
        <div className="w-[25%] h-full p-5">
          <div className="w-fit">
            <SelectableNodeList />
          </div>
        </div>
      </div>
    </div>
  );
}
