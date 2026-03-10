## 🏃‍➡️ Bài: Việt dã (MARATHON - HCM 2015-2016)

<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Bờm chạy trên một lộ trình dài $T$ đơn vị, với tổng thời gian tối đa cho phép là $M$ giây. 
Mất $U$ giây để lên dốc, $F$ giây để chạy đường phẳng, $D$ giây để xuống dốc (cho 1 đơn vị).
Bờm chạy đi rồi phải chạy về. Khi chạy về, **lên dốc sẽ biến thành xuống dốc, và ngược lại**.

**Yêu cầu:** Tìm quãng đường xa nhất Bờm có thể chạy đi và quay về kịp trong $M$ giây.

**Phân tích thời gian một vòng khép kín (Đi + Về) cho từng đoạn:**
- Nếu đoạn đường là lên dốc (`u` - up): Lượt đi mất $U$ giây, lượt về biến thành xuống dốc mất $D$ giây $\rightarrow$ Tổng: $U + D$.
- Nếu đoạn đường là xuống dốc (`d` - down): Lượt đi mất $D$ giây, lượt về biến thành lên dốc mất $U$ giây $\rightarrow$ Tổng: $D + U$.
- Nếu đoạn đường là bằng phẳng (`f` - flat): Lượt đi mất $F$ giây, lượt về vẫn phẳng mất $F$ giây $\rightarrow$ Tổng: $2 \times F$.

$\Rightarrow$ **Nhận xét quan trọng:** Thời gian chạy đi và về cho bất kỳ đoạn dốc nào (dù lên hay xuống) đều luôn luôn bằng **$U + D$**. Thời gian cho đoạn phẳng luôn là **$2F$**.
<div class="important-note">

**📌 Dạng bài:** Tham lam 
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Giải pháp Thuật toán: Tham lam (Greedy)</div>

### 💡 Ý tưởng
Vì Bờm phải chạy liên tục từ điểm xuất phát, ta chỉ cần mô phỏng từng bước chạy của Bờm.
1. Khởi tạo `thoi_gian_da_dung = 0` và `quang_duong = 0`.
2. Lặp qua từng đoạn đường từ đầu đến cuối. Với mỗi đoạn, tính `thoi_gian_di_ve` của đoạn đó theo quy luật đã phân tích.
3. Kiểm tra xem nếu chạy thêm đoạn này thì tổng thời gian có vượt quá $M$ hay không?
   - Nếu `thoi_gian_da_dung + thoi_gian_di_ve ≤ M`: Cho phép chạy đoạn này. Cộng dồn thời gian và tăng quãng đường lên 1.
   - Nếu `thoi_gian_da_dung + thoi_gian_di_ve > M`: Bờm sẽ không đủ thời gian để đi đoạn này và quay về. Bờm bắt buộc phải dừng lại ở đoạn trước đó và quay đầu. Kết thúc vòng lặp.

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">M</span>, <span class="var">T</span>, <span class="var">U</span>, <span class="var">F</span>, <span class="var">D</span>
<span class="var">thoi_gian_da_dung</span> = <span class="val">0</span>
<span class="var">quang_duong</span> = <span class="val">0</span>

<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">T</span>:
    <span class="kw">NHẬP</span> <span class="var">loai_dia_hinh</span> <span class="com">// 'u', 'f', hoặc 'd'</span>
    
    <span class="var">thoi_gian_doan_nay</span> = <span class="val">0</span>
    <span class="kw">NẾU</span> (<span class="var">loai_dia_hinh</span> == <span class="str">'u'</span> <span class="kw">HOẶC</span> <span class="var">loai_dia_hinh</span> == <span class="str">'d'</span>) <span class="kw">THÌ</span>:
        <span class="var">thoi_gian_doan_nay</span> = <span class="var">U</span> + <span class="var">D</span>
    <span class="kw">NGƯỢC LẠI</span>: <span class="com">// Địa hình 'f'</span>
        <span class="var">thoi_gian_doan_nay</span> = <span class="val">2</span> * <span class="var">F</span>
        
    <span class="kw">NẾU</span> (<span class="var">thoi_gian_da_dung</span> + <span class="var">thoi_gian_doan_nay</span> ≤ <span class="var">M</span>) <span class="kw">THÌ</span>:
        <span class="var">thoi_gian_da_dung</span> = <span class="var">thoi_gian_da_dung</span> + <span class="var">thoi_gian_doan_nay</span>
        <span class="var">quang_duong</span> = <span class="var">quang_duong</span> + <span class="val">1</span>
    <span class="kw">NGƯỢC LẠI</span>:
        <span class="kw">THOÁT_LẶP</span> <span class="com">// Không đủ thời gian, dừng lại và quay về</span>

<span class="kw">XUẤT</span> <span class="var">quang_duong</span>
</pre>
</div>

<div class="step-card border-purple">
    <div class="step-badge bg-purple">Bảng Đánh giá Thuật toán</div>
    
<div class="table-wrapper">
        <table class="algo-table">
            <thead>
                <tr>
                    <th style="width: 25%;">Đặc điểm</th>
                    <th class="th-green" style="width: 75%;">Tham lam (Greedy)</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="td-label">Độ phức tạp Thời gian</td>
                    <td>$O(T)$ (Chỉ 1 vòng lặp đi qua mảng địa hình). Tối đa $10^5$ phép lặp, cực kỳ nhanh. Đạt 100% test.</td>
                </tr>
                <tr>
                    <td class="td-label">Độ phức tạp Bộ nhớ</td>
                    <td>$O(1)$ nếu vừa đọc input vừa xử lý, hoặc $O(T)$ nếu lưu mảng ký tự. Cả hai đều rất an toàn.</td>
                </tr>
                <tr>
                    <td class="td-label">Cạm bẫy cần tránh</td>
                    <td>Nhiều học sinh quên tính thời gian cho <b>lượt về</b>, dẫn đến việc tính toán quãng đường đi được xa hơn thực tế.</td>
                </tr>
            </tbody>
        </table>
    </div>
</div>