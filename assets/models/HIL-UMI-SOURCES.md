# HIL-UMI 模型来源与许可

本模型保持真实设备的零件外形。OmniPicker 夹爪采用智元公开提供的原始模型；Quest 3 左手控制器采用 WebXR 输入设备资产库的对应型号；D405 采用 RealSense 官方机械网格。自制连接架和相机外罩根据实物照片及有效扫描部分拟合，属于近似复原。

## OmniPicker 夹爪

- 产品：AGIBOT OmniPicker（原厂 CAD 名称 OP1）。保留原厂宽指与窄指的不对称结构。
- 来源：[AGIBOT 官方产品手册](https://www.agibot.com/filepage/265.html)，第 8 节附录“URDF”。[原始下载包](https://www.agibot.com/file/ueditor/php/upload/file/20260804/1785825470874678.zip)。
- 使用内容：`robot_description` 内的 URDF/Xacro 以及 9 个 STL 零件网格。依据扫描装配位置和开合姿态调整刚体变换与关节角度，保留原始零件几何。电机与外壳按原 STL 的独立连通实体分色；宽/窄指的橡胶与银色背板边界按官方 STEP 独立实体进行表面对应，并统一原网格共面片的材质。连杆颜色参考官方产品图、论文及用户补充实物图。以上仅调整 PBR 材质，不改变原厂唯一三角面或顶点；灯光用于展示。
- 许可：原包 `package.xml` 声明 **Apache-2.0**，该声明副本保存在同目录 `OmniPicker_package.xml`，完整许可文本保存在 `OmniPicker_Apache-2.0.txt`（取自 [Apache 官方许可页面](https://www.apache.org/licenses/LICENSE-2.0.txt)）。
- 原始 ZIP 的 SHA-256：`ab379eac6f8997fceca5dbc139cb6ccf8ae26e52f7791795f67ac3b2849132f5`。
- 官方另提供完整 STEP 装配，用于结构核验和橡胶/金属表面分色参考（宽指实体 54/55，窄指实体 60/61）。最终夹爪几何使用上述 URDF 配套 STL，未将 STEP 转换网格合入最终模型。
- 尾部安装参考官方手册 §3.2–3.3 的尾盖螺钉及安装接口，以及官方 STL 内四颗径向螺钉的真实轴线（距原厂后端面 9.5 mm）。按用户实物说明，九件夹爪组件整体沿轴后移 4.3 mm，关节姿态不变；定制四耳通孔对齐这些轴线，直接露出原厂螺钉，移除重复添加的四颗螺钉。尾面与原位置薄背板之间留约 0.13 mm 展示余量。原始扫描配准矩阵保留在装配记录的 initial_scan_fit 字段；最终装配优先遵循实际安装接口，初始扫描拟合误差不作为最终配准精度。

## Quest 3 Touch Plus 左手控制器

- 型号：`meta-quest-touch-plus`，左手 `left.glb`，带 **X/Y 与菜单键**，对应论文和扫描中的左手控制器。
- 来源：[WebXR Input Profiles 资产库](https://github.com/immersive-web/webxr-input-profiles/tree/f4992299601614adbfefd398dc8e281556bb7444/packages/assets/profiles/meta-quest-touch-plus)。上游版本：`f4992299601614adbfefd398dc8e281556bb7444`。
- 使用内容：原始左手 GLB 的几何与贴图。先依据扫描刚性对齐，再按用户对实物安装方式的纠正，沿套筒轴整体插深 11 mm，使侧面 Grip 按钮从套筒口上方露出；未缩放或改变零件几何。初始扫描配准和最终位移分别记录在 `Quest3_刚性对齐参数.json`。
- 许可：资产包采用 **MIT License**，Copyright (c) 2019 Amazon。完整文本保存在同目录 `Quest3_WebXR_MIT.txt`；[上游许可文件](https://github.com/immersive-web/webxr-input-profiles/blob/f4992299601614adbfefd398dc8e281556bb7444/packages/assets/LICENSE.md)。
- 原始左手 GLB 的 SHA-256：`41a35b80221398d37029cbfaa9e39084ccd43e0206be72a5e8460f52e7882cb4`。
- Meta 官方 Hardware Art 中的 Touch Plus FBX 仅用于比对，**未用于最终模型**。

## RealSense D405

- 来源：[RealSense 官方 ROS 仓库](https://github.com/realsenseai/realsense-ros/blob/9a11121700cb4780e273e34141f6402fe184321d/realsense2_description/meshes/d405.stl)，版本 `9a11121700cb4780e273e34141f6402fe184321d`。
- 使用官方 `d405.stl` 的 3892 个三角形；仅进行毫米到米的单位转换及刚性对齐。标称 42 × 42 × 23 mm；原网格横向凸部使包围盒为 42.09 × 42 × 23 mm，未强行缩放。
- USB Micro-B 开口及侧面螺孔保留官方几何。官方机械网格省略了正面光学外观，该部分独立整理，依据官方数据表 Figure 10-13、官方 URDF 的 18 mm 双目基线和产品照片。
- 许可：Apache-2.0，完整上游文本见 `D405_Apache-2.0.txt`。来源及文件 SHA-256 见 `D405_来源校验.json`。
- 原厂 `D405_Solid.SLDPRT` 同时从[官方 CAD 下载页](https://dev.realsenseai.com/docs/cad-files/)获取，仅供核验；最终可交换模型使用许可明确的上述 STL。

## 扫描拟合部分

黑色连接架、控制器套座、D405 相机外罩及相机下方薄板的参考资料为用户提供的 `hil-umi.usdz`、论文 Fig. 3、补充装配近照及高清裸支架照片。OmniPicker 后接口采用连续薄背板和四片圆弧固定耳；固定耳内外表面为同心曲面，径向孔为真实贯通开口。照片中的窄侧沿属于这四片弧耳，没有额外添加上边条、下托架或整圈套筒，原厂电机和侧面 USB 保持开放可见。

补充照片和用户确认优先于错误扫描表面。手柄前端与相机薄板之间的扫描粘连已排除。用户确认薄板朝手柄一侧为直边，另一侧向背板内凹；模型以凹圆角过渡接入相机外罩，没有新增加强筋。定制件根据照片与有效扫描拟合，凹圆角曲率为近似值，不是原始 CAD 或实物设计半径。装配位置沿用扫描尺度与布局。

电机下方 U 形立柱的后面按用户确认收回至电机背板平面，接合处齐平。套筒外形保留；手柄整体插入深度按实物说明调整。

本成果用于论文插图和三维展示，不作为制造或装配公差依据。下载来源、文件校验保存在本目录的来源校验 JSON 中。

资料获取日期：2026-09-18。
