## 🧩 Bài: Diện tích phủ (XRECT - HCM 2014-2015)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Trong mặt phẳng tọa độ, DUYỆT $N$ hình chữ nhật có các cạnh song song với trục tọa độ ($1 \le N \le 1000$). Các hình chữ nhật được xác định bởi tọa độ đỉnh góc trái trên $(x_i, y_i)$ và góc phải dưới $(t_i, z_i)$.

**Yêu cầu:** Tính tổng diện tích phần mặt phẳng bị phủ bởi $N$ hình chữ nhật này (các phần giao nhau chỉ tính 1 lần).

**Ví dụ:**
- Hình 1: `0 3 4 0` (Góc trái trên (0, 3), phải dưới (4, 0)) $\rightarrow$ Diện tích = 12.
- Hình 2: `-1 1 4 0` $\rightarrow$ Diện tích = 5.
- Hình 3: `1 2 3 -1` $\rightarrow$ Diện tích = 6.
$\Rightarrow$ Phần giao nhau sẽ bị loại trừ, tổng diện tích phủ thực tế là **15**.
<div class="important-note">

**📌 Dạng bài:** Ma trận đánh dấu - Hình học
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn bằng Mảng đánh dấu (O(Diện tích))</div>

### 💡 Ý tưởng
Nếu tọa độ các đỉnh là các số nhỏ (ví dụ từ -1000 đến 1000), ta có thể tịnh tiến tọa độ (cộng thêm 1000 để loại bỏ số âm) và dùng một mảng 2D `visited[Y][X]` để biểu diễn từng ô vuông $1 \times 1$ trên mặt phẳng.
- Duyệt qua từng hình chữ nhật, tô màu (gán `true`) DUYỆT tất cả các ô $1 \times 1$ nằm bên trong nó.
- Cuối cùng, đếm số lượng ô có giá trị `true`.

**Mã giả:**
<pre class="pseudocode">
<span class="kw">DUYỆT MỖI</span> <span class="var">hcn</span> <span class="kw">TRONG</span> <span class="var">danh_sách</span>:
    <span class="kw">DUYỆT</span> <span class="var">x</span> từ <span class="var">x_trái</span> <span class="kw">ĐẾN</span> <span class="var">x_phải</span> - 1:
        <span class="kw">DUYỆT</span> <span class="var">y</span> từ <span class="var">y_dưới</span> <span class="kw">ĐẾN</span> <span class="var">y_trên</span> - 1:
            <span class="var">visited</span>[<span class="var">y</span>][<span class="var">x</span>] = <span class="kw">true</span>;

<span class="var">dien_tich</span> = <span class="fn">Đếm_số_ô_true</span>(<span class="var">visited</span>);
</pre>
**Nhược điểm:** Nếu tọa độ lên tới $10^9$, mảng 2D sẽ vượt quá bộ nhớ và thời gian chạy (Memory Limit / Time Limit).
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Rời rạc hóa tọa độ (Coordinate Compression)</div>

### 💡 Ý tưởng Tối ưu
Dù tọa độ có thể rất lớn (lên đến hàng tỷ), nhưng chỉ có tối đa $N$ hình chữ nhật, nghĩa là chỉ có tối đa $2N$ giá trị tọa độ X và $2N$ giá trị tọa độ Y phân biệt. 
Thay vì chia mặt phẳng thành các ô $1 \times 1$ đều nhau, ta dùng chính các "đường thẳng" tạo bởi các cạnh của hình chữ nhật để chia mặt phẳng thành một **lưới không đều**.

1. **Thu thập và Sắp xếp:** Gom tất cả tọa độ X vào mảng `CX`, tọa độ Y vào mảng `CY`. Sắp xếp và loại bỏ các phần tử trùng lặp.
2. **Lưới mới:** Các đường $x = CX[i]$ và $y = CY[j]$ sẽ tạo thành các "ô lưới lớn" (cell). 
   - Chiều rộng của ô là $W = CX[i+1] - CX[i]$.
   - Chiều cao của ô là $H = CY[j+1] - CY[j]$.
3. **Đánh dấu:** Duyệt qua các ô lưới này, kiểm tra xem tâm của ô lưới có nằm trong bất kỳ hình chữ nhật nào không. Nếu có, cộng thêm $W \times H$ vào tổng diện tích.

**Mã giả**
<pre class="pseudocode">
<span class="com">// BƯỚC 1: THU THẬP VÀ RỜI RẠC HÓA (NÉN) TỌA ĐỘ</span>
<span class="var">CX</span> = []; <span class="var">CY</span> = [];
<span class="kw">DUYỆT MỖI</span> <span class="var">hcn</span> <span class="kw">TRONG</span> <span class="var">danh_sách_HCN</span>:
    <span class="fn">Thêm</span> <span class="var">hcn.x1</span>, <span class="var">hcn.x2</span> <span class="kw">vào</span> <span class="var">CX</span>;
    <span class="fn">Thêm</span> <span class="var">hcn.y1</span>, <span class="var">hcn.y2</span> <span class="kw">vào</span> <span class="var">CY</span>;

<span class="fn">Sắp_xếp_tăng_dần</span>(<span class="var">CX</span>); <span class="fn">Sắp_xếp_tăng_dần</span>(<span class="var">CY</span>);
<span class="fn">Xóa_các_phần_tử_trùng_lặp</span>(<span class="var">CX</span>);
<span class="fn">Xóa_các_phần_tử_trùng_lặp</span>(<span class="var">CY</span>);

<span class="com">// BƯỚC 2: DUYỆT CÁC Ô LƯỚI "LỚN" ĐƯỢC TẠO RA</span>
<span class="var">tong_dien_tich</span> = <span class="val">0</span>;

<span class="kw">DUYỆT</span> <span class="var">i</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="fn">Độ_dài</span>(<span class="var">CX</span>) - <span class="val">2</span>:
    <span class="kw">DUYỆT</span> <span class="var">j</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="fn">Độ_dài</span>(<span class="var">CY</span>) - <span class="val">2</span>:
        <span class="com">// Lấy tọa độ tâm của ô lưới hiện tại để kiểm tra</span>
        <span class="var">x_tam</span> = (<span class="var">CX[i]</span> + <span class="var">CX[i+1]</span>) / <span class="val">2.0</span>;
        <span class="var">y_tam</span> = (<span class="var">CY[j]</span> + <span class="var">CY[j+1]</span>) / <span class="val">2.0</span>;
        
        <span class="com">// Kiểm tra xem tâm ô lưới này có lọt vào HCN nào không</span>
        <span class="var">bi_phu</span> = <span class="kw">false</span>;
        <span class="kw">DUYỆT MỖI</span> <span class="var">hcn</span> <span class="kw">TRONG</span> <span class="var">danh_sách_HCN</span>:
            <span class="kw">NẾU</span> (<span class="var">hcn.x1</span> <= <span class="var">x_tam</span> <= <span class="var">hcn.x2</span>) <span class="kw">VÀ</span> (<span class="var">hcn.y2</span> <= <span class="var">y_tam</span> <= <span class="var">hcn.y1</span>) <span class="kw">THÌ</span>:
                <span class="var">bi_phu</span> = <span class="kw">true</span>;
                <span class="kw">THOÁT_LẶP_DUYỆT_MỖI</span>; <span class="com">// Chỉ cần 1 HCN phủ là đủ</span>
        
        <span class="com">// Nếu bị phủ, cộng diện tích của nguyên ô lưới đó</span>
        <span class="kw">NẾU</span> (<span class="var">bi_phu</span> == <span class="kw">true</span>) <span class="kw">THÌ</span>:
            <span class="var">chieu_rong</span> = <span class="var">CX[i+1]</span> - <span class="var">CX[i]</span>;
            <span class="var">chieu_cao</span> = <span class="var">CY[j+1]</span> - <span class="var">CY[j]</span>;
            <span class="var">tong_dien_tich</span> = <span class="var">tong_dien_tich</span> + (<span class="var">chieu_rong</span> * <span class="var">chieu_cao</span>);

<span class="kw">XUẤT</span> <span class="var">tong_dien_tich</span>;
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng So sánh 2 Phương pháp</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 20%;">Tiêu chí</th>
                    <th class="th-orange" style="width: 40%;">Cách 1: Vét cạn (Đánh dấu mảng 2D)</th>
                    <th class="th-green" style="width: 40%;">Cách 2: Rời rạc hóa + Đánh dấu</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Kiến thức</td>
                    <td>Mảng 2D, Vòng lặp lồng nhau cơ bản.</td>
                    <td>Sắp xếp, Mảng động (Vector/Set), Rời rạc hóa tọa độ.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Không gian</td>
                    <td>$O(\max(X) \times \max(Y))$ (Phụ thuộc vào giá trị tọa độ).</td>
                    <td>$O(N^2)$ (Chỉ phụ thuộc vào số lượng hình chữ nhật).</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(N \times \text{Area})$ (Rất chậm nếu diện tích phủ lớn).</td>
                    <td>$O(N^3)$ hoặc tối ưu xuống $O(N^2)$ (Rất nhanh và ổn định).</td>
                </tr>
                <tr>
                    <td class="td-label">Khả năng AC</td>
                    <td class="td-warning">Đạt <b>50% số điểm</b> (Pass các test có tọa độ nhỏ). Dễ bị Memory Limit.</td>
                    <td class="td-optimal">Đạt <b>100% số điểm</b>. Không sợ tọa độ âm hay tọa độ lớn.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>