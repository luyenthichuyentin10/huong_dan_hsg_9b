## 🔤 Bài: Kí tự (KITU - HCM 2018-2019)
<br>
<div class="step-card border-blue">
<div class="step-badge bg-blue">Phân tích đề bài</div>

Cho xâu $S$ độ dài tối đa 1000 ký tự gồm cả chữ hoa và thường.

**Yêu cầu:** Tìm xâu $T$ gồm các ký tự **in hoa** có thứ tự từ điển **tăng ngặt** (ký tự sau phải lớn hơn ký tự trước theo bảng chữ cái) sao cho độ dài của $T$ là lớn nhất.

**Bước 0: Tiền xử lý (Tiền đề quan trọng)**
Đề chỉ quan tâm đến các ký tự in hoa. Vì vậy, để đơn giản hóa, ta duyệt xâu $S$, lọc toàn bộ các chữ cái in hoa ra một mảng (hoặc xâu) mới đặt tên là $A$.

Ví dụ: $S$ = `aADbCBcdDCEefDEgFh` $\rightarrow$ Mảng $A$ = `[A, D, C, B, D, C, E, D, E, F]`

Bài toán đưa về: **Tìm dãy con tăng dài nhất (LIS) trên mảng $A$**.
<div class="important-note">

**📌 Dạng bài:** Quy hoạch động
</div>
</div>

<div class="step-card border-orange">
<div class="step-badge bg-orange">Cách 1: Vét cạn (Quay lui / Đệ quy - Tối đa 50% điểm)</div>

### 💡 Ý tưởng
Thử tạo ra tất cả các dãy con có thể có từ mảng $A$. Với mỗi ký tự $A[i]$, ta có 2 lựa chọn: Hoặc **chọn** nó vào dãy con, hoặc **bỏ qua**. Nếu chọn, ta phải đảm bảo nó lớn hơn ký tự vừa chọn trước đó. Cuối cùng, lấy độ dài lớn nhất.

**Hạn chế:** Thuật toán duyệt mọi tổ hợp có độ phức tạp là $O(2^N)$. Với $N = 1000$, $2^{1000}$ là một con số khổng lồ, chắc chắn sẽ bị TLE (Time Limit Exceeded) với bộ test lớn.

<pre class="pseudocode">
<span class="var">Max_Len</span> = <span class="val">0</span>

<span class="kw">HÀM</span> <span class="fn">VetCan</span>(<span class="var">index</span>, <span class="var">last_char</span>, <span class="var">current_len</span>):
    <span class="var">Max_Len</span> = <span class="fn">MAX</span>(<span class="var">Max_Len</span>, <span class="var">current_len</span>)
    
    <span class="kw">NẾU</span> (<span class="var">index</span> ≥ <span class="var">N</span>) <span class="kw">THÌ TRẢ VỀ</span>
    
    <span class="com">// Lựa chọn 1: Bỏ qua ký tự hiện tại</span>
    <span class="fn">VetCan</span>(<span class="var">index</span> + <span class="val">1</span>, <span class="var">last_char</span>, <span class="var">current_len</span>)
    
    <span class="com">// Lựa chọn 2: Chọn ký tự hiện tại (nếu thỏa mãn tăng dần)</span>
    <span class="kw">NẾU</span> (<span class="var">A[index]</span> > <span class="var">last_char</span>) <span class="kw">THÌ</span>:
        <span class="fn">VetCan</span>(<span class="var">index</span> + <span class="val">1</span>, <span class="var">A[index]</span>, <span class="var">current_len</span> + <span class="val">1</span>)
</pre>
</div>

<div class="step-card border-green">
<div class="step-badge bg-green">Cách 2: Quy hoạch động (Tối ưu 100% điểm)</div>

### 💡 Phân tích 3 bước Quy hoạch động (DP)

**Bước 1: Xác định trạng thái và Base case**
- Ta dùng mảng $DP[i]$ với ý nghĩa: **Độ dài của dãy con tăng ngặt dài nhất kết thúc tại phần tử $A[i]$**.
- **Base case (Khởi tạo):** Tại bất kỳ vị trí $i$ nào, bản thân phần tử $A[i]$ cũng có thể tự đứng một mình để tạo thành một dãy con độ dài 1. Nên khởi tạo $DP[i] = 1$ với mọi $i$.
- **Kết quả bài toán:** $DP[n]$

**Bước 2: Phân tích thuật toán để tạo công thức truy hồi**
- Mỗi lần thêm 1 kí tự mới vào chuỗi A tại vị trí i, nếu ta xác định chuỗi A bắt đầu từ vị trí i này thì độ dài chuỗi A sẽ là 1 $\rightarrow$ $DP[i] = 1$
- Để tính $DP[i]$, ta nhìn lại toàn bộ các phần tử $A[j]$ đứng trước nó ($0 \le j < i$).
- Nếu $A[j] < A[i]$, nghĩa là ta có thể ghép $A[i]$ vào sau dãy con kết thúc tại $A[j]$ để tạo thành một dãy tăng dần dài hơn.
- Khi đó, độ dài mới sẽ là $DP[j] + 1$. Ta sẽ chọn ghép vào dãy nào mang lại độ dài lớn nhất.
- **Công thức:** `NẾU (A[j] < A[i]) THÌ DP[i] = MAX(DP[i], DP[j] + 1)`

**Bước 3: Tạo bảng DP ví dụ mẫu**
Với mảng $A$ = `[A, D, C, B, D, C, E, D, E, F]`, ta có bảng DP như sau:

| Chỉ số | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **A** | A | D | C | B | D | C | E | D | E | F |
| **DP** | 1 | 2 | 2 | 2 | 3 | 3 | 4 | 4 | 5 | 6 |

<pre class="pseudocode">
<span class="kw">NHẬP</span> <span class="var">S</span>
<span class="var">A</span> = <span class="fn">Mảng_rỗng</span>()

<span class="com">// Lọc các ký tự in hoa</span>
<span class="kw">LẶP MỖI</span> <span class="var">char</span> <span class="kw">TRONG</span> <span class="var">S</span>:
    <span class="kw">NẾU</span> (<span class="var">char</span> ≥ <span class="str">'A'</span> <span class="kw">VÀ</span> <span class="var">char</span> ≤ <span class="str">'Z'</span>) <span class="kw">THÌ</span>:
        <span class="var">A</span>.Them(<span class="var">char</span>)

<span class="var">N</span> = <span class="fn">Kich_Thuoc</span>(<span class="var">A</span>)
<span class="kw">NẾU</span> (<span class="var">N</span> == <span class="val">0</span>) <span class="kw">THÌ</span>:
    <span class="kw">XUẤT</span> <span class="val">0</span>
    <span class="kw">KẾT_THÚC</span>

<span class="var">DP</span> = <span class="fn">Mang</span>(<span class="var">N</span>, <span class="val">1</span>) <span class="com">// Khởi tạo mảng DP toàn số 1</span>
<span class="var">Ket_Qua</span> = <span class="val">1</span>

<span class="com">// Quy hoạch động O(N^2)</span>
<span class="kw">LẶP</span> <span class="var">i</span> từ <span class="val">1</span> <span class="kw">ĐẾN</span> <span class="var">N</span> - <span class="val">1</span>:
    <span class="kw">LẶP</span> <span class="var">j</span> từ <span class="val">0</span> <span class="kw">ĐẾN</span> <span class="var">i</span> - <span class="val">1</span>:
        <span class="kw">NẾU</span> (<span class="var">A[j]</span> < <span class="var">A[i]</span>) <span class="kw">THÌ</span>:
            <span class="var">DP</span>[<span class="var">i</span>] = <span class="fn">MAX</span>(<span class="var">DP</span>[<span class="var">i</span>], <span class="var">DP</span>[<span class="var">j</span>] + <span class="val">1</span>)
            
    <span class="var">Ket_Qua</span> = <span class="fn">MAX</span>(<span class="var">Ket_Qua</span>, <span class="var">DP</span>[<span class="var">i</span>])

<span class="kw">XUẤT</span> <span class="var">Ket_Qua</span>
</pre>
</div>