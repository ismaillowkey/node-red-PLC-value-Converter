# Node-RED Contrib PLC Value Converter

[English](#english) | [Bahasa Indonesia](#bahasa-indonesia)

---

## English

A Node-RED custom node designed to seamlessly convert Modbus 16-bit register arrays into various human-readable data types (Float, Integer, String) and vice versa. 

### Nodes Included:
1. **PLC Value Converter**: Reads an array of 16-bit registers (e.g., from a Modbus Read node) and converts them into numeric values (Float, Int, Uint).
2. **PLC Write Converter**: Converts numeric values back into an array of 16-bit registers to be written into a PLC (e.g., via a Modbus Write node).
3. **String Converter**: Reads an array of 16-bit registers and converts them into ASCII strings (supports Normal and Reverse byte ordering).
4. **Write String Converter**: Converts an ASCII string into an array of 16-bit registers to be written to a PLC.

### How Many Registers (Array Length) Are Needed?
When reading or writing from Modbus, data types require different amounts of 16-bit registers:
- **Int16 / UInt16**: Requires **1 register** (1 array element).
- **Int32 / UInt32**: Requires **2 registers** (2 array elements).
- **Float32**: Requires **2 registers** (2 array elements).
- **Float64 (Double)**: Requires **4 registers** (4 array elements).
- **String**: 
  - If `1 Word = 1 Character`: Requires exactly the length of the string (e.g., 5 characters = 5 registers).
  - If `1 Word = 2 Characters`: Requires half the length of the string (e.g., 10 characters = 5 registers).

### Outputs
- **Output 1 (Success)**: Contains the successfully converted value (or array).
- **Output 2 (Error)**: Outputs an error message if the conversion fails (e.g., if the input array is too short for the chosen data type).

---

## Bahasa Indonesia

Sebuah custom node Node-RED yang dirancang untuk mempermudah konversi array register 16-bit Modbus menjadi berbagai tipe data yang mudah dibaca manusia (Float, Integer, String) dan juga sebaliknya.

### Node yang Tersedia:
1. **PLC Value Converter**: Membaca array dari register 16-bit (contohnya dari node Modbus Read) dan mengkonversinya menjadi angka numerik (Float, Int, Uint).
2. **PLC Write Converter**: Mengkonversi angka numerik kembali menjadi array register 16-bit untuk ditulis ke PLC (contohnya melalui node Modbus Write).
3. **String Converter**: Membaca array dari register 16-bit dan mengubahnya menjadi teks/string ASCII (mendukung pertukaran byte/huruf Normal dan Reverse).
4. **Write String Converter**: Mengubah teks/string ASCII menjadi array register 16-bit untuk ditulis ke PLC.

### Berapa Jumlah Register (Array) yang Dibutuhkan?
Saat membaca atau menulis dari Modbus, tipe data yang berbeda membutuhkan jumlah register 16-bit yang berbeda pula:
- **Int16 / UInt16**: Butuh **1 register** (1 elemen array).
- **Int32 / UInt32**: Butuh **2 register** (2 elemen array).
- **Float32**: Butuh **2 register** (2 elemen array).
- **Float64 (Double)**: Butuh **4 register** (4 elemen array).
- **String**: 
  - Jika `1 Word = 1 Character`: Butuh sebanyak jumlah huruf teks (misal 5 huruf = 5 register).
  - Jika `1 Word = 2 Characters`: Butuh setengah dari jumlah huruf teks (misal 10 huruf = 5 register).

### Output Node
- **Output 1 (Berhasil)**: Berisi nilai (atau array) hasil konversi yang sukses.
- **Output 2 (Error)**: Mengeluarkan pesan error jika konversi gagal (contoh: jika panjang array input dari Modbus kurang dari kebutuhan tipe data).

---
**Powered by Ismail Lookey**
