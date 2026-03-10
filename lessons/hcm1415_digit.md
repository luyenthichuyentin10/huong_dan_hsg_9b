## 🔄 Bài: Đổi số (DIGIT - HCM 2014-2015)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Bờm chuyển đổi một số $N$ ở hệ cơ số 10 sang hệ cơ số 2 và cơ số 3, nhưng ở mỗi kết quả, Bờm đều viết sai **chính xác một chữ số** và không làm thay đổi chiều dài của số.
- **Dữ liệu vào:** Dòng 1 là số hệ 2 (bị sai 1 chữ số), Dòng 2 là số hệ 3 (bị sai 1 chữ số).
- **Yêu cầu:** Tìm lại số $N$ gốc (hệ 10). Biết $N \le 10^{18}$.

**Ví dụ:**
- Hệ 2 sai: `1010`
- Hệ 3 sai: `212`

$\Rightarrow$ Số $N$ đúng là **14**. (Giải thích: 14 ở hệ 2 là `1110` - khác `1010` một chữ số; 14 ở hệ 3 là `112` - khác `212` một chữ số).
<div class="important-note">

**📌 Dạng bài:** Sinh tập hợp - tìm kiếm nhị phân  
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Brute Force)</div>

### 💡 Ý tưởng
Dựa vào chiều dài của chuỗi cơ số 2 và cơ số 3, ta có thể xác định được khoảng giá trị của $N$ (từ `minn` đến `maxx`). Ta sẽ thử từng giá trị $i$ trong khoảng này:
1. Chuyển $i$ sang chuỗi hệ 2 và hệ 3.
2. So sánh với chuỗi đề bài cho. Nếu cả 2 chuỗi đều khác đúng 1 ký tự $\Rightarrow i$ là đáp án.

**Đánh giá:** Rất chậm. Với $N \le 10^{18}$, khoảng cách từ `minn` đến `maxx` là khổng lồ, chắc chắn sẽ bị Time Limit Exceeded (TLE).

**Mã giả:**
<pre class="pseudocode">
<span class="var">minn</span>, <span class="var">maxx</span> = <span class="fn">Tim_Khoang_Gia_Tri</span>(<span class="var">s2</span>, <span class="var">s3</span>);
<span class="kw">CHO</span> <span class="var">i</span> từ <span class="var">minn</span> <span class="kw">ĐẾN</span> <span class="var">maxx</span>:
    <span class="var">str2</span> = <span class="fn">DecToAny</span>(<span class="var">i</span>, <span class="val">2</span>);
    <span class="var">str3</span> = <span class="fn">DecToAny</span>(<span class="var">i</span>, <span class="val">3</span>);
    <span class="kw">NẾU</span> (<span class="fn">DemKhacBiet</span>(<span class="var">s2</span>, <span class="var">str2</span>) == <span class="val">1</span> <span class="kw">VÀ</span> <span class="fn">DemKhacBiet</span>(<span class="var">s3</span>, <span class="var">str3</span>) == <span class="val">1</span>) <span class="kw">THÌ</span>:
        <span class="kw">XUẤT</span> <span class="var">i</span>; <span class="kw">THOÁT</span>;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Sinh tập hợp & Tìm kiếm nhị phân (Tối ưu)</div>

### 💡 Ý tưởng
Thay vì thử mọi số $N$, ta nhận thấy số lượng các số "có khả năng đúng" là rất ít.
1. **Sinh mảng M2:** Từ chuỗi `s2` (hệ 2), ta thử lật từng bit (0 thành 1, 1 thành 0). Chuyển các chuỗi mới này sang hệ 10 và lưu vào mảng `M2`. Số lượng phần tử tối đa khoảng 60.
2. **Sinh mảng M3:** Từ chuỗi `s3` (hệ 3), ta thử đổi từng ký tự sang 2 ký tự còn lại. Chuyển sang hệ 10 và lưu vào `M3`. Số lượng phần tử tối đa khoảng 76.
3. **Tìm số chung:** Sắp xếp mảng `M3` tăng dần. Duyệt qua từng số trong `M2` và dùng **Tìm kiếm nhị phân** (Binary Search) để tìm xem nó có nằm trong `M3` không. Số tìm thấy chính là $N$.


**Mã giả:**
<pre class="pseudocode">
<span class="fn">He2</span>(<span class="var">s2</span>); <span class="com">// Sinh mảng M2 chứa các số hệ 10 từ s2</span>
<span class="fn">He3</span>(<span class="var">s3</span>); <span class="com">// Sinh mảng M3 chứa các số hệ 10 từ s3</span>

<span class="fn">Sort</span>(<span class="var">M3</span>);

<span class="kw">CHO MỖI</span> <span class="var">x</span> <span class="kw">TRONG</span> <span class="var">M2</span>:
    <span class="kw">NẾU</span> (<span class="fn">BinarySearch</span>(<span class="var">M3</span>, <span class="var">x</span>) == <span class="kw">TRUE</span>) <span class="kw">THÌ</span>:
        <span class="kw">XUẤT</span> <span class="var">x</span>;
        <span class="kw">THOÁT</span>;
</pre>
</div>