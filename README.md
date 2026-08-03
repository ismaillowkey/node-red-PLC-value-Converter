# Node-RED Contrib PLC Value Converter

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

A Node-RED custom node designed to seamlessly convert Modbus 16-bit register arrays into various human-readable data types (Float, Integer, String) and vice versa. 

> [!NOTE]
> This node is designed as an add-on / companion to be used alongside the **[node-red-contrib-modbus](https://flows.nodered.org/node/node-red-contrib-modbus)** library.

### Nodes Included:
1. **PLC Value Converter**: Reads an array of 16-bit registers (e.g., from a Modbus Read node) and converts them into numeric values (Float, Int, Uint).
2. **PLC Write Converter**: Converts numeric values back into an array of 16-bit registers to be written into a PLC (e.g., via a Modbus Write node).
3. **String Converter**: Reads an array of 16-bit registers and converts them into ASCII strings (supports Normal and Reverse byte ordering).
4. **Write String Converter**: Converts an ASCII string into an array of 16-bit registers to be written to a PLC.
5. **Unix (s) to Date**: Converts a Unix timestamp (seconds) into a date array `[Year, Month, Day, Hour, Minute, Second]`.
6. **Unix (ms) to Date**: Converts a Unix timestamp (milliseconds) into a date array `[Year, Month, Day, Hour, Minute, Second, Millisecond]`.
7. **Date to Unix (s)**: Converts a date array `[Year, Month, Day, Hour, Minute, Second]` into a Unix timestamp (seconds).

### How Many Registers (Array Length) Are Needed?
When reading or writing from Modbus, data types require different amounts of 16-bit registers:
- **Int16 / UInt16**: Requires **1 register** (1 array element).
- **Int32 / UInt32**: Requires **2 registers** (2 array elements).
- **Float32**: Requires **2 registers** (2 array elements).
- **Float64 (Double)**: Requires **4 registers** (4 array elements).
- **Int64 / UInt64**: Requires **4 registers** (4 array elements).
- **String**: 
  - If `1 Word = 1 Character`: Requires exactly the length of the string (e.g., 5 characters = 5 registers).
  - If `1 Word = 2 Characters`: Requires half the length of the string (e.g., 10 characters = 5 registers).

### Outputs
- **Output 1 (Success)**: Contains the successfully converted value (or array).
- **Output 2 (Error)**: Outputs an error message if the conversion fails (e.g., if the input array is too short for the chosen data type).

---

## Bahasa Indonesia

Sebuah custom node Node-RED yang dirancang untuk mempermudah konversi array register 16-bit Modbus menjadi berbagai tipe data yang mudah dibaca manusia (Float, Integer, String) dan juga sebaliknya.

> [!NOTE]
> Node ini adalah tambahan (add-on) pendamping yang dirancang khusus untuk digunakan bersama dengan library utama **[node-red-contrib-modbus](https://flows.nodered.org/node/node-red-contrib-modbus)**.

### Node yang Tersedia:
1. **PLC Value Converter**: Membaca array dari register 16-bit (contohnya dari node Modbus Read) dan mengkonversinya menjadi angka numerik (Float, Int, Uint).
2. **PLC Write Converter**: Mengkonversi angka numerik kembali menjadi array register 16-bit untuk ditulis ke PLC (contohnya melalui node Modbus Write).
3. **String Converter**: Membaca array dari register 16-bit dan mengubahnya menjadi teks/string ASCII (mendukung pertukaran byte/huruf Normal dan Reverse).
4. **Write String Converter**: Mengubah teks/string ASCII menjadi array register 16-bit untuk ditulis ke PLC.
5. **Unix (s) to Date**: Mengonversi Unix timestamp (detik) menjadi array tanggal `[Tahun, Bulan, Tanggal, Jam, Menit, Detik]`.
6. **Unix (ms) to Date**: Mengonversi Unix timestamp (milidetik) menjadi array tanggal `[Tahun, Bulan, Tanggal, Jam, Menit, Detik, Milidetik]`.
7. **Date to Unix (s)**: Mengonversi array tanggal `[Tahun, Bulan, Tanggal, Jam, Menit, Detik]` menjadi Unix timestamp (detik).

### Berapa Jumlah Register (Array) yang Dibutuhkan?
Saat membaca atau menulis dari Modbus, tipe data yang berbeda membutuhkan jumlah register 16-bit yang berbeda pula:
- **Int16 / UInt16**: Butuh **1 register** (1 elemen array).
- **Int32 / UInt32**: Butuh **2 register** (2 elemen array).
- **Float32**: Butuh **2 register** (2 elemen array).
- **Float64 (Double)**: Butuh **4 register** (4 elemen array).
- **Int64 / UInt64**: Butuh **4 register** (4 elemen array).
- **String**: 
  - Jika `1 Word = 1 Character`: Butuh sebanyak jumlah huruf teks (misal 5 huruf = 5 register).
  - Jika `1 Word = 2 Characters`: Butuh setengah dari jumlah huruf teks (misal 10 huruf = 5 register).

### Output Node
- **Output 1 (Berhasil)**: Berisi nilai (atau array) hasil konversi yang sukses.
- **Output 2 (Error)**: Mengeluarkan pesan error jika konversi gagal (contoh: jika panjang array input dari Modbus kurang dari kebutuhan tipe data).

---

## Example Flow
You can import this example flow directly into your Node-RED workspace (Menu > Import):

```json
[
    {
        "id": "013b72e1d574a0f6",
        "type": "tab",
        "label": "Flow 1",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "4c6ae9949798b88e",
        "type": "value-converter",
        "z": "013b72e1d574a0f6",
        "name": "",
        "endianness": "ABCD",
        "targetType": "float32",
        "x": 480,
        "y": 280,
        "wires": [
            [
                "ee5ead7d7d5af35f"
            ],
            []
        ]
    },
    {
        "id": "77ef62b3d4af500a",
        "type": "modbus-read",
        "z": "013b72e1d574a0f6",
        "name": "",
        "topic": "",
        "showStatusActivities": false,
        "logIOActivities": false,
        "showErrors": false,
        "showWarnings": true,
        "unitid": "",
        "dataType": "HoldingRegister",
        "adr": "0",
        "quantity": "2",
        "rate": "500",
        "rateUnit": "ms",
        "delayOnStart": false,
        "enableDeformedMessages": false,
        "startDelayTime": "",
        "server": "6e3b57a9f8933018",
        "useIOFile": false,
        "ioFile": "",
        "useIOForPayload": false,
        "emptyMsgOnFail": false,
        "x": 130,
        "y": 320,
        "wires": [
            [
                "4c6ae9949798b88e"
            ],
            []
        ]
    },
    {
        "id": "ec6f4f3270362fbd",
        "type": "write-converter",
        "z": "013b72e1d574a0f6",
        "name": "",
        "endianness": "ABCD",
        "sourceType": "float32",
        "x": 550,
        "y": 580,
        "wires": [
            [
                "19bda6390147b053"
            ],
            []
        ]
    },
    {
        "id": "19bda6390147b053",
        "type": "modbus-write",
        "z": "013b72e1d574a0f6",
        "name": "",
        "showStatusActivities": false,
        "showErrors": false,
        "showWarnings": true,
        "unitid": "",
        "dataType": "MHoldingRegisters",
        "adr": "0",
        "quantity": "2",
        "server": "6e3b57a9f8933018",
        "emptyMsgOnFail": false,
        "keepMsgProperties": false,
        "delayOnStart": false,
        "startDelayTime": "",
        "x": 900,
        "y": 560,
        "wires": [
            [],
            []
        ]
    },
    {
        "id": "2c1590801b58a78c",
        "type": "inject",
        "z": "013b72e1d574a0f6",
        "name": "",
        "props": [
            {
                "p": "payload"
            }
        ],
        "repeat": "1",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "payload": "11.234",
        "payloadType": "num",
        "x": 220,
        "y": 540,
        "wires": [
            [
                "ec6f4f3270362fbd"
            ]
        ]
    },
    {
        "id": "ee5ead7d7d5af35f",
        "type": "debug",
        "z": "013b72e1d574a0f6",
        "name": "debug 1",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "false",
        "statusVal": "",
        "statusType": "auto",
        "x": 940,
        "y": 380,
        "wires": []
    },
    {
        "id": "6e3b57a9f8933018",
        "type": "modbus-client",
        "name": "",
        "clienttype": "tcp",
        "bufferCommands": true,
        "stateLogEnabled": false,
        "queueLogEnabled": false,
        "failureLogEnabled": true,
        "tcpHost": "127.0.0.1",
        "tcpPort": "502",
        "tcpType": "DEFAULT",
        "serialPort": "COM10",
        "serialType": "RTU-BUFFERD",
        "serialBaudrate": 9600,
        "serialDatabits": 8,
        "serialStopbits": 1,
        "serialParity": "none",
        "serialConnectionDelay": 100,
        "serialAsciiResponseStartDelimiter": "0x3A",
        "unit_id": 1,
        "commandDelay": 1,
        "clientTimeout": 1000,
        "reconnectOnTimeout": true,
        "reconnectTimeout": 2000,
        "parallelUnitIdsAllowed": true,
        "showErrors": false,
        "showWarnings": true,
        "showLogs": true
    },
    {
        "id": "cbf314c6462afc0a",
        "type": "global-config",
        "env": [],
        "modules": {
            "node-red-contrib-plc-value-converter": "0.2.0",
            "node-red-contrib-modbus": "5.60.1"
        }
    }
]
```

---
**Powered by Ismail Lowkey**
