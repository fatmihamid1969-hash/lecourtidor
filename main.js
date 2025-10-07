const GITHUB_OWNER = "fatmihamid1969-hash";
const GITHUB_REPO = "lecourtidor";

// رابط API لجلب كل Issues (العقارات)
const ISSUES_API = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues?state=open&per_page=100`;

// رابط نموذج إضافة Issue جديد مع حقول مسبقة التعبئة
const NEW_ISSUE_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}/issues/new?title=عنوان+العقار+هنا&body=%F0%9F%93%8D+%2A%2Aالعنوان%2A%2A%3A+%0A%F0%9F%93%A2+%2A%2Aالوصف%2A%2A%3A+%0A%F0%9F%92%B0+%2A%2Aالسعر%2A%2A%3A+%0A%F0%9F%8E%9E+%2A%2Aرابط+الصورة%2A%2A%3A+`;

// عند تحميل الصفحة: جلب العقارات من GitHub Issues
window.onload = async function() {
  // ضبط زر إضافة عقار جديد
  document.getElementById('add-property-btn').href = NEW_ISSUE_URL;

  // جلب العقارات
  const propsContainer = document.getElementById('properties-list');
  propsContainer.innerHTML = "<p style='color:#b89146;text-align:center;font-weight:bold'>...جاري تحميل العقارات</p>";
  try {
    const res = await fetch(ISSUES_API);
    if (!res.ok) throw new Error("تعذر جلب العقارات من GitHub");
    const issues = await res.json();

    // إذا لا توجد عقارات
    if (!issues.length) {
      propsContainer.innerHTML = "<p style='color:#b89146;text-align:center;font-weight:bold'>لا توجد عقارات حالياً.</p>";
      return;
    }

    // عرض كل عقار كبطاقة
    propsContainer.innerHTML = "";
    issues.forEach(issue => {
      const data = extractPropertyFromIssue(issue);
      const card = createPropertyCard(data);
      propsContainer.appendChild(card);
    });
  } catch (err) {
    propsContainer.innerHTML = "<p style='color:red;text-align:center'>حدث خطأ أثناء تحميل العقارات!</p>";
    console.error(err);
  }
};

// استخراج بيانات العقار من محتوى الـ Issue
function extractPropertyFromIssue(issue) {
  const body = issue.body || "";
  const title = issue.title || "";
  const descMatch = body.match(/الوصف(?:\*+)?[:：]?\s*([\s\S]*?)(?:\n|$)/i);
  const priceMatch = body.match(/السعر(?:\*+)?[:：]?\s*([\s\S]*?)(?:\n|$)/i);
  const imgMatch = body.match(/رابط(?:\s)?الصورة(?:\*+)?[:：]?\s*(https?:\/\/[^\s]+)/i);

  return {
    title: title,
    description: descMatch ? descMatch[1].trim() : "",
    price: priceMatch ? priceMatch[1].trim() : "",
    imageUrl: imgMatch ? imgMatch[1].trim() : "",
    issueUrl: issue.html_url
  };
}

// بناء بطاقة العقار
function createPropertyCard(data) {
  const card = document.createElement('div');
  card.className = 'property-card';

  const img = document.createElement('img');
  img.className = 'property-image';
  img.src = data.imageUrl || 'https://via.placeholder.com/330x200?text=بدون+صورة';
  img.alt = data.title || 'عقار';

  const content = document.createElement('div');
  content.className = 'property-content';

  const title = document.createElement('div');
  title.className = 'property-title';
  title.textContent = data.title;

  const desc = document.createElement('div');
  desc.className = 'property-description';
  desc.textContent = data.description;

  const price = document.createElement('div');
  price.className = 'property-price';
  price.textContent = data.price ? `${data.price} دج` : "";

  const contactBtn = document.createElement('a');
  contactBtn.className = 'property-contact-btn';
  contactBtn.href = "https://wa.me/213557913512";
  contactBtn.target = "_blank";
  contactBtn.innerHTML = `<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="واتساب"/> تواصل عبر واتساب`;

  const detailsBtn = document.createElement('a');
  detailsBtn.href = data.issueUrl;
  detailsBtn.target = "_blank";
  detailsBtn.textContent = "تفاصيل أكثر";
  detailsBtn.style = "display:inline-block;margin-right:12px;color:#b89146;font-size:0.96rem;text-decoration:underline;";

  content.appendChild(title);
  content.appendChild(desc);
  content.appendChild(price);
  content.appendChild(contactBtn);
  content.appendChild(detailsBtn);

  card.appendChild(img);
  card.appendChild(content);

  return card;
}
