export type Attribute = {
  name: string;
  type: string;
  PK?: boolean;
  FK?: boolean;
};

export type Entity = {
  name: string;
  attributes: Attribute[];
};

const EntityTable = ({ entities }: { entities: Entity[] }) => {
  return (
    <div className="p-5">
      <h2 className="text-xl font-bold">Entities</h2>
      <table className="w-full border-collapse border border-gray-300 mt-3">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Entity Name</th>
            <th className="border p-2">Attributes</th>
          </tr>
        </thead>
        <tbody>
          {entities.map((entity, index) => (
            <tr key={index} className="border">
              <td className="border p-2">{entity.name}</td>
              <td className="border p-2">
                {entity.attributes.map((attr, i) => (
                  <div key={i}>
                    {attr.name} ({attr.type}) {attr.PK ? "[PK]" : ""}{" "}
                    {attr.FK ? "[FK]" : ""}
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EntityTable;
