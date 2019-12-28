import React, { useState, useCallback } from 'react';
import { parseString } from 'xml2js';
import DropZone from './DropZone';

const App = () => {
  const [fileName, setFileName] = useState('');
  const [xmlJson, setXmlJson] = useState('');

  const displayContent = data => {
    if (typeof data === 'string' || data instanceof String) {
      return data;
    }
    if (Array.isArray(data)) {
      if (typeof data[0] === 'object' || data[0] instanceof Object) {
        return Object.keys(data[0]).map(key => {
          return (
            <p>
              <strong>{key}:&nbsp;</strong>
              {data[0][key]}
            </p>
          );
        });
      }
      return data[0];
    }
  };

  const onDrop = useCallback(([file]) => {
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = () => {
        parseString(reader.result, (_, result) => {
          const { System: data } = result;
          setXmlJson(data);
        });
      };
      reader.onerror = () => {
        console.error(`Unable to read file: ${reader.error}`);
      };
    }
  }, []);

  const reset = () => {
    setFileName('');
    setXmlJson('');
  };

  return (
    <div className="container-fluid">
      <h1 className="mt-3">CSE Detection</h1>
      <DropZone onDrop={onDrop} />
      <div>
        {xmlJson && (
          <>
            <div className="d-flex mt-3">
              <h3>{fileName}</h3>
              <button className="btn btn-warning align-self-end ml-2" onClick={reset}>
                <span className="font-weight-bold">&#8635;</span>
              </button>
            </div>
            <table className="mt-3 table table-bordered">
              <caption>CSE Detection xml data</caption>
              <thead>
                <tr>
                  <th>Application_Name</th>
                  <th>Application_Version</th>
                  <th>Computer_Name</th>
                  <th>Scan_Date</th>
                  <th>Hardware_Inventory</th>
                  <th>ME_Firmware_Information</th>
                  <th>System_Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{displayContent(xmlJson.Application_Name)}</td>
                  <td>{displayContent(xmlJson.Application_Version)}</td>
                  <td>{displayContent(xmlJson.Computer_Name)}</td>
                  <td>{displayContent(xmlJson.Scan_Date)}</td>
                  <td>{displayContent(xmlJson.Hardware_Inventory)}</td>
                  <td>{displayContent(xmlJson.ME_Firmware_Information)}</td>
                  <td>{displayContent(xmlJson.System_Status)}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
