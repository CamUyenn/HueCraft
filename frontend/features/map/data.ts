import { StreetViewNode } from './types';

export const STREET_VIEW_NODES: StreetViewNode[] = [
  {
    id: 'node-1',
    title: 'Điểm 01: Tuyến Phố Đi Bộ & Chợ Cố Đô Ban Ngày',
    subtitle: 'Không gian ngập tràn sắc màu lồng đèn và ẩm thực xứ Huế',
    address: 'Phố đi bộ Chu Văn An - Võ Thị Sáu, TP. Huế',
    image: '/panoramas/hue_walking_street_day.jpg',
    thumbnail: '/panoramas/hue_walking_street_day.jpg',
    mapCoords: {
      x: 30,
      y: 70,
    },
    initialYaw: 0,
    initialPitch: -2,
    links: [
      {
        targetId: 'node-2',
        label: 'Tiến vào Phố Làng Nghề Thủ Công (Chập Tối)',
        direction: 'forward',
        yaw: 0,
        pitch: -22,
      },
    ],
    hotspots: [
      {
        id: 'hs-1-food',
        title: 'Quán Đặc Sản Ẩm Thực Huế',
        description:
          'Thưởng thức các món đặc sản bánh bèo, nậm, lọc, ram ít và bún bò giò heo đậm đà phong vị ẩm thực Cố đô.',
        yaw: -38,
        pitch: -4,
        category: 'craft',
        icon: 'shopping-bag',
      },
      {
        id: 'hs-1-lantern',
        title: 'Gian Hàng Lồng Đèn Thủ Công Hội An & Huế',
        description:
          'Dãy đèn lồng vải lụa truyền thống rực rỡ sắc màu được đan lát thủ công tinh xảo giăng kín tuyến phố đi bộ.',
        yaw: 36,
        pitch: -2,
        category: 'culture',
        icon: 'flame',
      },
      {
        id: 'hs-1-tea',
        title: 'Quán Trà Cung Đình & Cà Phê Cố Đô',
        description:
          'Thưởng ngoạn các loại trà cung đình thanh tao cùng thảo mộc tự nhiên theo công thức quý truyền lại từ Hoàng cung triều Nguyễn.',
        yaw: 58,
        pitch: -6,
        category: 'info',
        icon: 'sparkles',
      },
    ],
  },
  {
    id: 'node-2',
    title: 'Điểm 02: Tuyến Phố Làng Nghề Truyền Thống Huế',
    subtitle: 'Nghệ thuật Nón Lá Bài Thơ & Đèn Lồng Cung Đình Lung Linh',
    address: 'Đường ven sông Hương, Phường Phú Hòa, TP. Huế',
    image: '/panoramas/hue_artisan_street.jpg',
    thumbnail: '/panoramas/hue_artisan_street.jpg',
    mapCoords: {
      x: 52,
      y: 48,
    },
    initialYaw: 5,
    initialPitch: -3,
    links: [
      {
        targetId: 'node-1',
        label: 'Quay lại Phố Đi Bộ Ban Ngày',
        direction: 'backward',
        yaw: 185,
        pitch: -24,
      },
      {
        targetId: 'node-3',
        label: 'Tiến về Cầu Đá & Cổng Ngọ Môn Hoàng Thành',
        direction: 'forward',
        yaw: 6,
        pitch: -20,
      },
    ],
    hotspots: [
      {
        id: 'hs-2-hats',
        title: 'Xưởng Trình Diễn Nón Bài Thơ Huế',
        description:
          'Nghệ nhân địa phương đang tỉ mỉ chằm từng vành nón lá trắng mịn. Khi soi dưới ánh sáng, bạn sẽ thấy bài thơ xứ Huế và hình ảnh cầu Tràng Tiền hiện lên lung linh.',
        yaw: -42,
        pitch: -2,
        category: 'craft',
        icon: 'sparkles',
        villageId: 'non-la-conical-hat',
      },
      {
        id: 'hs-2-lanterns',
        title: 'Phố Đèn Lồng & Hoa Giấy Cố Đô',
        description:
          'Dãy đèn lồng vải lụa và hoa giấy Thanh Tiên ngũ sắc thắp sáng rực rỡ mặt tiền các căn nhà gỗ cổ kính mang phong vị kinh kỳ xưa.',
        yaw: 48,
        pitch: 5,
        category: 'culture',
        icon: 'flame',
        villageId: 'thanh-tien-paper-flower',
      },
      {
        id: 'hs-2-cyclo',
        title: 'Xe Xích Lô Du Lịch Huế',
        description:
          'Phương tiện di chuyển thong thả đặc trưng giúp du khách ngắm nhìn từng góc phố rêu phong của Cố đô.',
        yaw: 18,
        pitch: -15,
        category: 'info',
        icon: 'landmark',
      },
    ],
  },
  {
    id: 'node-3',
    title: 'Điểm 03: Kỳ Đài & Cổng Ngọ Môn Soi Bóng Sông Hương',
    subtitle: 'Toàn cảnh Cầu Đá Cổ, Hào Thành & Bến Thuyền Rồng',
    address: 'Quảng trường Ngọ Môn, Hoàng Thành Huế',
    image: '/panoramas/hue_imperial_gate.jpg',
    thumbnail: '/panoramas/hue_imperial_gate.jpg',
    mapCoords: {
      x: 76,
      y: 28,
    },
    initialYaw: -6,
    initialPitch: -2,
    links: [
      {
        targetId: 'node-2',
        label: 'Quay lại Tuyến Phố Làng Nghề',
        direction: 'backward',
        yaw: 178,
        pitch: -22,
      },
      {
        targetId: 'node-1',
        label: 'Về lại Tuyến Phố Đi Bộ Ban Ngày',
        direction: 'left',
        yaw: 220,
        pitch: -20,
      },
    ],
    hotspots: [
      {
        id: 'hs-3-gate',
        title: 'Cổng Ngọ Môn & Kỳ Đài Huế',
        description:
          'Công trình biểu tượng lịch sử triều Nguyễn với cờ đỏ sao vàng tung bay trên nền trời Cố đô Huế soi bóng xuống làn nước biếc.',
        yaw: -4,
        pitch: 6,
        category: 'scenic',
        icon: 'landmark',
      },
      {
        id: 'hs-3-boat',
        title: 'Bến Thuyền Rồng Sông Hương',
        description:
          'Nơi neo đậu thuyền rồng phục vụ các tour ca Huế trên sông Hương và thả hoa đăng lung linh về đêm.',
        yaw: 62,
        pitch: -8,
        category: 'culture',
        icon: 'ship',
      },
      {
        id: 'hs-3-bridge',
        title: 'Cầu Đá & Đèn Hoa Đăng Hào Thành',
        description:
          'Chiếc cầu đá cổ bắc qua dòng hào nước dẫn lối vào cửa ngõ Đại Nội, hai bên treo dãy lồng đèn cổ điển.',
        yaw: 25,
        pitch: -12,
        category: 'scenic',
        icon: 'sparkles',
      },
    ],
  },
];
