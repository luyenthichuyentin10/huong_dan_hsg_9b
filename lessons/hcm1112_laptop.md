## Bài 2: Laptop

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Vân muốn mua một chiếc laptop dựa trên 4 thông số: **Tốc độ CPU**, **Dung lượng RAM**, **Dung lượng HDD** và **Giá**.

**Quy tắc lựa chọn:**
1.  **Loại bỏ:** Một laptop bị loại bỏ nếu cả 3 thông số (CPU, RAM, HDD) đều **nhỏ hơn** cả 3 thông số tương ứng của một laptop bất kỳ khác.
2.  **Lựa chọn:** Trong số những laptop còn lại, Vân chọn chiếc có **giá rẻ nhất**.

**Ví dụ:**
- Laptop 1: 2100, 512, 150 (Giá 200)
- Laptop 3: 2300, 1024, 200 (Giá 320)
$\rightarrow$ Laptop 1 bị loại vì $2100 < 2300$, $512 < 1024$ và $150 < 200$.
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp thuật toán</div>

### 💡 Dạng bài Addhoc - tham lam
1.  **Kiểm tra tính hợp lệ:** Duyệt qua từng laptop $i$. Với mỗi laptop $i$, duyệt qua tất cả laptop $j$ còn lại để kiểm tra xem $i$ có bị laptop $j$ nào "áp đảo" cả 3 thông số hay không. Nếu bị áp đảo, đánh dấu laptop $i$ là không hợp lệ.
2.  **Tìm giá rẻ nhất:** Trong danh sách các laptop không bị đánh dấu loại bỏ, tìm laptop có giá thấp nhất và xuất ra chỉ số của nó.

**Mã giả thuật toán:**
<pre class="pseudocode">
<span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="var">hop_le</span>[<span class="var">i</span>] = <span class="kw">true</span>;
    <span class="kw">CHO</span> <span class="var">j</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
        <span class="kw">NẾU</span> (<span class="var">cpu</span>[<span class="var">i</span>] < <span class="var">cpu</span>[<span class="var">j</span>] <span class="kw">VÀ</span> <span class="var">ram</span>[<span class="var">i</span>] < <span class="var">ram</span>[<span class="var">j</span>] <span class="kw">VÀ</span> <span class="var">hdd</span>[<span class="var">i</span>] < <span class="var">hdd</span>[<span class="var">j</span>]) <span class="kw">THÌ</span>:
            <span class="var">hop_le</span>[<span class="var">i</span>] = <span class="kw">false</span>;
            <span class="kw">THOÁT VÒNG LẶP J</span>;

<span class="var">gia_min</span> = <span class="val">999999</span>; <span class="var">chon_id</span> = <span class="val">-1</span>;
<span class="kw">CHO</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span>:
    <span class="kw">NẾU</span> (<span class="var">hop_le</span>[<span class="var">i</span>] == <span class="kw">true</span> <span class="kw">VÀ</span> <span class="var">gia</span>[<span class="var">i</span>] < <span class="var">gia_min</span>) <span class="kw">THÌ</span>:
        <span class="var">gia_min</span> = <span class="var">gia</span>[<span class="var">i</span>];
        <span class="var">chon_id</span> = <span class="var">i</span>;

<span class="kw">XUẤT</span> <span class="var">chon_id</span>;
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Độ phức tạp</div>

- **Thời gian:** $O(N^2)$ do sử dụng hai vòng lặp lồng nhau để so sánh các laptop. Với $N \le 100$, thuật toán chạy cực nhanh.
- **Không gian:** $O(N)$ để lưu trữ mảng thông số các laptop.
</div>