# 3D model sources

- `franka-panda.glb` is a web-optimized derivative of the Franka Emika Panda model from
  [Google DeepMind MuJoCo Menagerie](https://github.com/google-deepmind/mujoco_menagerie/tree/main/franka_emika_panda),
  licensed under Apache-2.0. The conversion follows the link-frame layout used by
  [Shengyang Zhuang's interactive robot viewer](https://github.com/shengyangzhuang/shengyangzhuang.github.io/tree/main/assets/models).
- `mobile-aloha.glb` is a web-optimized copy of the public COBOT MAGIC model served by the
  [AgileX Robotics product page](https://www.agilex.ai/page/690aef2d5e78cfa260412cb5). The
  original model remains copyright AgileX Robotics. Geometry was simplified and compressed for
  browser delivery; its appearance and proportions were not redesigned.
- `hil-umi.glb` is the HIL-UMI device reconstruction supplied by Zihao Zhao. It combines a
  user-reconstructed mounting assembly with the AGIBOT OmniPicker, Meta Quest 3 Touch Plus, and
  RealSense D405 assets. Detailed provenance is recorded in `HIL-UMI-SOURCES.md`; the corresponding
  Apache-2.0 and MIT license texts are stored beside the model.

Three.js and its example modules are distributed under the MIT License; see
`assets/vendor/THREE-LICENSE.txt`.
