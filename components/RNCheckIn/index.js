/**
 * Created by guguyanhua on 11/4/15.
 */
var React = require('react-native');
var _ = require('lodash');
var moment = require('moment');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    PixelRatio,
    TouchableHighlight,
    TouchableOpacity,
    Image
    } = React;
import Theme from '../../views/theme';
var I18n = require('react-native-i18n');
/**
 *
 * 传入的数据结构 checkIn
 * {
 *  2015-11:[
 *    2015-11-01,
 *    2015-11-02,
 *    2015-11-03,
 *    2015-11-09,
 *  ]
 * }
 *
 *
 *
 *
 */

class MonthHeader extends React.Component {
  render() {
    return (
        <View style={[styles.row, styles.row_header]}>
          <View style={[styles.flex_1]}>
            <Text style={[styles.headerStyle,Theme.subTitleFont]}>{I18n.t('mon')}</Text>
          </View>
          <View style={[styles.flex_1]}>
            <Text style={[styles.headerStyle,Theme.subTitleFont]}>{I18n.t('tue')}</Text>
          </View>
          <View style={[styles.flex_1]}>
            <Text style={[styles.headerStyle,Theme.subTitleFont]}>{I18n.t('wed')}</Text>
          </View>
          <View style={[styles.flex_1]}>
            <Text style={[styles.headerStyle,Theme.subTitleFont]}>{I18n.t('thu')}</Text>
          </View>
          <View style={[styles.flex_1]}>
            <Text style={[styles.headerStyle,Theme.subTitleFont]}>{I18n.t('fri')}</Text>
          </View>
          <View style={[styles.flex_1]}>
            <Text style={[[styles.headerStyle,Theme.subTitleFont]]}>{I18n.t('sat')}</Text>
          </View>
          <View style={[styles.flex_1]}>
            <Text style={[[styles.headerStyle,Theme.subTitleFont]]}>{I18n.t('sun')}</Text>
          </View>
        </View>
    );
  }
}

var Month = React.createClass({
      render(){
        var checkIn = this.state.currentMonth;
        var key = _.keys(checkIn)[0];
        var value = checkIn[key];
        var m = moment(key, "YYYY-MM");
        var year = m.year();
        var month = m.month();

        var newDate = new Date(year, month + 1, 0); //本月最后一天 === 下一个月的第0天
        var week = new Date(year, month, 1).getDay(); //月份开始的星期

        if (week === 0) {
          week = 7;
        }
        var counts = newDate.getDate(); //本月的最后一天就是本月的总天数
        var rowCounts = Math.ceil((counts + week - 1) / 7); //本月行数

        var rows = [];

        for (var i = 0; i < rowCounts; i++) {
          var days = [];
          for (var j = (i * 7); j < ((i + 1) * 7); j++) {
            //根据每个月开始的［星期］往后推
            var dayNum = j - week + 1;
            if (dayNum > 0 && j < counts + week) {
              //如果当前日期小于今天，则变灰
              var dateStr = '';
              //写的不好 FIXME
              dateStr = year + ((month < 10 ) ? '-0' : '-') + (month + 1) + ((dayNum < 10 ) ? '-0' : '-') + dayNum;

              var dayStyle = {};
              var bk = {};
              if (_.includes(value, dateStr)) {
                //bk = {  //TODO 这里要显示下面的白点
                //  width: 25,
                //  height: 25,
                //  alignItems: 'center',
                //  justifyContent: 'center',
                //  borderRadius: 12.5,
                //};
                dayStyle = {
                  color: 'white',
                  fontWeight: 'bold',
                }
              } else {
                dayStyle = {
                  color: 'rgba(255,255,255,0.5)'
                }
              }
              days.push(
                  <View style={[styles.flex_1,styles.border_1]}>
                    <Text style={dayStyle}>{dayNum}</Text>
                  </View>
              );
            } else {
              days.push(
                  <View style={[styles.flex_1,styles.border_1]}>
                    <Text></Text>
                  </View>
              );
            }

          }
          rows.push(
              <View style={[styles.row]}>{days}</View>
          );
        }

        var textView = null;
        if (value && value.length > 0) {
          textView =
              <Text
                  style={[styles.month_text,Theme.titleFont]}>
                {newDate.getFullYear() + I18n.t('year')
                + (newDate.getMonth() + 1) + I18n.t('month')  }({value.length + I18n.t('times')})
              </Text>
        } else {
          textView = <Text
              style={[styles.month_text,Theme.titleFont]}>{newDate.getFullYear() + I18n.t('year') + (newDate.getMonth() + 1) + I18n.t('month')  }</Text>
        }
        return (
            <View>
              <View style={styles.month}>
                <TouchableOpacity onPress={this.prev}>
                  <Image source={require('../../images/btn_arrow_left02.png')} style={styles.buttonIcon}/>
                </TouchableOpacity>
                {textView}
                <TouchableOpacity onPress={this.next}>
                  <Image source={require('../../images/btn_arrow_right02.png')} style={styles.buttonIcon}/>
                </TouchableOpacity>
              </View>
              <MonthHeader />
              {rows}
            </View>
        );

      },
      prev(){
        var current = _.keys(this.state.currentMonth)[0];
        var m = moment(current, "YYYY-MM");
        m.subtract(1, 'M');
        var month = m.format('YYYY-MM');
        var currentMonthValue = {};
        if (this.props.months[month]) {
          currentMonthValue[month] = this.props.months[month];
        } else {
          currentMonthValue[month] = [];
        }
        this.setState({
          currentMonth: currentMonthValue
        });
      },
      next(){
        var current = _.keys(this.state.currentMonth)[0];
        var m = moment(current, "YYYY-MM");
        m.add(1, 'M'); //获取下个月,还要判断是否溢出
        var month = m.format('YYYY-MM');
        var currentMonthValue = {};
        if (this.props.months[month]) {
          currentMonthValue[month] = this.props.months[month];
        } else {
          currentMonthValue[month] = [];
        }
        this.setState({
          currentMonth: currentMonthValue
        });
      },
      getInitialState() {
        var m = moment();
        var month = m.format('YYYY-MM');
        var currentMonthValue = {};
        if (this.props.months[month]) {
          currentMonthValue[month] = this.props.months[month];
        } else {
          currentMonthValue[month] = [];
        }
        return {
          currentMonth: currentMonthValue
        }
      }
    })
    ;

var CheckIn = React.createClass({
  render() {
    return (
        <View>
          <Month
              months={this.props.months}
              {...this.props}
              />
        </View>
    );
  }

});


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue'
  },
  flex_1: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendar_container: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopWidth: 1 / PixelRatio.get(),
    borderBottomWidth: 1 / PixelRatio.get(),
    borderColor: '#ccc'
  },
  row_header: {
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  row: {
    flexDirection: 'row',
    height: 40,
  },
  month: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  month_text: {
    fontSize: 18,
    //fontWeight: 'bold',
    color: 'white'
  },
  border_1: {
    borderWidth: 1 / PixelRatio.get(),
    borderColor: '#2a2a2a',
  },
  headerStyle: {
    color: 'white',
  },
  buttonIcon: {
    width: 32,
    height: 32,
  }
});

module.exports = CheckIn;
