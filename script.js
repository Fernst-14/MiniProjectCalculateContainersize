// Product Master เก็บข้อมูลสินค้า
const productMaster = {
  A1001: {
    standard: 360,
    startMax: false, // start max = no
  },
  A1002: {
    standard: 360,
    startMax: true, // start max = yes
  },
  A2001: {
    standard: 540,
    startMax: false, // start max = no
  },
  A2002: {
    standard: 540,
    startMax: true, // start max = yes
  },
};

function calContainer() {
  const productNo = document.getElementById("productNo").value;
  const orderQty = Number(document.getElementById("orderQty").value);

  const product = productMaster[productNo]; // ดึงข้อมูลสินค้าจาก product master ตาม product no ที่เลือก
  const standard = product.standard; // ดึงข้อมูล standard
  const startMax = product.startMax; // ดึงข้อมูล start max

  const results = [];

  // เช็คว่ามีการกรอก order qty มาหรือไม่ ถ้าไม่มีให้แจ้งเตือน
  if (!orderQty || orderQty <= 0) {
    alert("Please enter order quantity");
    return;
  }

  if (startMax) {
    // Start Max = Yes ใส่ตู้แรกๆให้เต็มก่อนที่เหลือใส่ตู้สุดท้าย
    let remainQty = orderQty;
    let containerNo = 1;

    while (remainQty > 0) {
      const qty = Math.min(remainQty, standard); // หาจํานวนที่สามารถใส่ได้ไม่เกิน standard

      results.push({
        containerNo,
        qty,
        productNo,
        standard,
      });

      remainQty -= qty; // หักจํานวนที่ใส่ไปแล้วออก จากจํานวนที่เหลือ
      containerNo++;
    }
  } else {
    // Start Max = No คำนวณเฉลี่ยทุกตู้ให้ใกล้เคียงกัน
    const containerCount = Math.ceil(orderQty / standard); // หาจำนวนตู้ทั้งหมด โดยปัดขึ้นถ้ามีเศษต้องใช้ตู้เพิ่ม
    const baseQty = Math.floor(orderQty / containerCount); // หาจํานวนที่ใส่ในแต่ละตู้ โดยปัดลง
    let remainQty = orderQty % containerCount; // หาเศษที่เหลือแล้วกระจายใส่ในตู้

    for (let i = 1; i <= containerCount; i++) {
      let qty = baseQty;

      if (remainQty > 0) {
        qty += 1;
        remainQty -= 1;
      }

      results.push({
        containerNo: i,
        qty,
        productNo,
        standard,
      });
    }
  }

  renderResult(results, orderQty);
}

function renderResult(results, orderQty) {
  const resultBody = document.getElementById("result");
  const summary = document.getElementById("summary");

  let rowsHtml = "";

  results.forEach((item) => {
    rowsHtml += `
      <tr>
        <td>${item.containerNo}</td>
        <td>${item.qty}</td>
        <td>${item.productNo}</td>
        <td>${item.standard}</td>
      </tr>
    `;
  });

  resultBody.innerHTML = rowsHtml;
  summary.textContent = `Container = ${results.length} of ${orderQty}`;
}

function renderProductMaster() {
  const productMasterBody = document.getElementById("productMaster");

  productMasterBody.innerHTML = "";

  // วนอ่านข้อมูลสินค้าจาก product master และส่งไปแสดงในตาราง
  Object.keys(productMaster).forEach((productNo) => {
    const product = productMaster[productNo];

    const row = `
      <tr>
        <td>${productNo}</td>
        <td>${product.standard}</td>
        <td>${product.startMax ? "Yes" : "No"}</td>
      </tr>
    `;

    productMasterBody.innerHTML += row;
  });
}

renderProductMaster();
calContainer();