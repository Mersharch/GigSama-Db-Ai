import { useAppState } from "@/hooks/useAppState";
import { getLatestValidSchema } from "@/lib/utils";
import React, { useState, useEffect } from "react";

interface Column {
  name: string;
  type: string;
  PK?: boolean;
  FK?: boolean;
}

interface Table {
  name: string;
  columns: Column[];
}

const XMLRenderer: React.FC = () => {
  const { project } = useAppState();
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  const latestSchema = project
    ? getLatestValidSchema(project.conversation)
    : null;

  useEffect(() => {
    if (latestSchema && latestSchema.schemaCode) {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(
          latestSchema?.schemaCode,
          "text/xml"
        );
        const tableNodes = xmlDoc.getElementsByTagName("table");

        const parsedTables: Table[] = Array.from(tableNodes).map(
          (tableNode) => {
            const name = tableNode.getAttribute("name") || "";
            const columnNodes = tableNode.getElementsByTagName("column");

            const columns = Array.from(columnNodes).map((colNode) => ({
              name: colNode.getAttribute("name") || "",
              type: colNode.getAttribute("type") || "string",
              PK: colNode.getAttribute("PK") === "true",
              FK: colNode.getAttribute("FK") === "true",
            }));

            return { name, columns };
          }
        );

        setTables(parsedTables);
      } catch (err) {
        setError("Failed to parse XML.");
        console.error("XML Parsing Error:", err);
      }
    }
  }, [latestSchema, project]);

  console.log(project);
  console.log(latestSchema);

  return (
    <div className="p-5 flex flex-wrap justify-center gap-4">
      {latestSchema === null ? (
        ""
      ) : error ? (
        <p className="text-red-500 text-center text-sm">{error}</p>
      ) : (
        tables.map((table) => (
          <div
            key={table.name}
            className="bg-white shadow-md rounded-lg p-4 border border-gray-300 w-3/4 sm:w-1/4 md:w-1/3 lg:w-1/4  transition-all duration-300 transform hover:scale-105"
          >
            <h3 className="text-lg font-bold text-gray-700 text-center">
              {table.name}
            </h3>
            <table className="w-full mt-2 border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border-b p-2 text-left text-xs">Column</th>
                  <th className="border-b p-2 text-left text-xs">Type</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col) => (
                  <tr key={col.name} className="border-t">
                    <td
                      className={`p-2 text-xs ${
                        col.PK
                          ? "font-bold text-blue-600"
                          : col.FK
                          ? "italic text-green-600"
                          : ""
                      }`}
                    >
                      {col.name} {col.PK ? "(PK)" : col.FK ? "(FK)" : ""}
                    </td>
                    <td className="p-2 text-xs">{col.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default XMLRenderer;
