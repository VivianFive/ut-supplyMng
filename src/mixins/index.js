
import { collect } from "../api/index";
export default {
    data() {
        return {
            dashboardData: {},
            s_time: '2015/01/01',
            e_time: null,
            options_s: {
                disabledDate(date) {
                    return date && date.valueOf() < new Date('2015/01/01');
                }
            }
        };
    },
    created() {
        this.getCollect();
    },
    methods: {
        getCollect() {
            collect().then(res => {
                let map = {
                    1: 'big',
                    2: 'year',
                    3: 'service',
                    4: 'expend',
                    5: 'amount',
                    6: 'grossSales'
                };
                let temp = {};
                res.list.forEach(li => {
                    if (map[li.type]) {
                        temp[map[li.type]] = li.value;
                    }
                });
                this.dashboardData = temp;
            });
        }
    }
};
