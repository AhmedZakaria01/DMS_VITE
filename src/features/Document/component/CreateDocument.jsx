import CategoryTable from "./CategoryTable";
import DocumentForm from "./DocumentForm";


// function CreateDocument() {
//   return <>

//  <div className="flex">
//    <DocumentForm/>
//    <CategoryTable/>
//  </div>
//   </>
// }

function CreateDocument() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 p-6">
      {/* DocumentForm - 60% width on large screens */}
      <div className="flex-1 xl:flex-[0.8]">
        <DocumentForm/>
      </div>
      
      {/* CategoryTable - 40% width on large screens */}
      <div className="flex-1 xl:flex-[0.2]">
        <CategoryTable/>
      </div>
    </div>
  );
}

export default CreateDocument;
