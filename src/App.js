import React, { useState, useEffect } from 'react';
import { parseString } from 'xml2js';
import { Table } from 'react-bootstrap';

function App() {
  const [file, setFile] = useState(null);
  const [xmlJson, setXmlJson] = useState('');
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'utf-8');
      reader.onload = () => {
        parseString(reader.result, (err, result) => {
          const { System: data } = result;
          setXmlJson(data);
        });
      };
      reader.onerror = () => {
        console.error(`Unable to read file: ${reader.error}`);
      };
    }
  }, [file]);

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

  return (
    <div className="container-fluid">
      <h1>CSE Detection</h1>
      <div className="form-group">
        <label htmlFor="file-input">Detection XML file</label>
        <input
          id="file-input"
          className="form-control-file"
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
      </div>
      <div>
        {xmlJson && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
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
                <td>1</td>
                <td>{displayContent(xmlJson.Application_Name)}</td>
                <td>{displayContent(xmlJson.Application_Version)}</td>
                <td>{displayContent(xmlJson.Computer_Name)}</td>
                <td>{displayContent(xmlJson.Scan_Date)}</td>
                <td>{displayContent(xmlJson.Hardware_Inventory)}</td>
                <td>{displayContent(xmlJson.ME_Firmware_Information)}</td>
                <td>{displayContent(xmlJson.System_Status)}</td>
              </tr>
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}

export default App;
