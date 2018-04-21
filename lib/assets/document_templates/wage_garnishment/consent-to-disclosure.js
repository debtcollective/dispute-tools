const { PDF_WRITER_CONFIG } = require('../../../../services/renderers/DisputeTemplate');

const coor = (x, y) => [x, y, PDF_WRITER_CONFIG];
const phoneCoor = (x, y, fontSize = 9) => [x, y, { ...PDF_WRITER_CONFIG, fontSize }];

module.exports = {
  member: {
    name: coor(263, 196),
    address: coor(153, 213),
    city: coor(107, 237),
    state: coor(315, 237),
    zip: coor(453, 237),
    phone: {
      areaCode: phoneCoor(100, 257),
      rest: phoneCoor(121, 257),
    },
    email: coor(311, 257),
    ssn: coor(196, 278),
    dob: coor(478, 276),
  },
  representatives: {
    names: coor(207, 360),
    address: coor(155, 381),
    city: coor(101, 398),
    state: coor(315, 399),
    zip: coor(451, 399),
    phones: phoneCoor(106, 422, 8),
    relationships: coor(374, 420),
  },
  signature: {
    date: coor(101, 608),
    signature: coor(265, 608),
  },
};
