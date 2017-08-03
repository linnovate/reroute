import _ from 'lodash';

function json2rule(ruleObj) {
  const conditions = [];
  let conditionsFuncs = '';
  Object.keys(ruleObj.conditions).forEach((item) => {
    const currentItem = ruleObj.conditions[item];
    switch (currentItem.sign) {
      case 'equal': {
        conditions.push(`this.fact.${currentItem.factProp} === '${currentItem.value}'`);
        break;
      }
      case 'equal or null': {
        conditions.push(`(!this.fact.${currentItem.factProp} || this.fact.${currentItem.factProp} === '${currentItem.value}')`);
        break;
      }
      case 'in multi range': {
        const range = [];
        currentItem.value.forEach((val) => {
          range.push(`new Date(this.fact.${currentItem.factProp.min}).setHours(0, 0, 0, 0) <= new Date('${val.max}').setHours(0, 0, 0, 0) && new Date(this.fact.${currentItem.factProp.max}).setHours(0, 0, 0, 0) >= new Date('${val.min}').setHours(0, 0, 0, 0)`);
        });
        conditions.push(`(${_.join(range, ' || ')})`);
        break;
      }
      case 'not in multi range': {
        const range = [];
        currentItem.value.forEach((val) => {
          range.push(`new Date(this.fact.${currentItem.factProp.min}).setHours(0, 0, 0, 0) <= new Date('${val.max}').setHours(0, 0, 0, 0) && new Date(this.fact.${currentItem.factProp.max}).setHours(0, 0, 0, 0) >= new Date('${val.min}').setHours(0, 0, 0, 0)`);
        });
        conditions.push(`!(${_.join(range, ' || ')})`);
        break;
      }
      case 'in days array': {
        conditions.push(`[${currentItem.value}].indexOf(new Date(this.fact.${currentItem.factProp}).getDay()) > -1`);
        break;
      }
      case 'range in days array': {
        conditionsFuncs = `${conditionsFuncs} var isInDates = function(date1, date2, range) {
          var d1 = new Date(date1);
          var d2 = new Date(date2); 
          while (d1 <= d2) {
          var day = new Date(d1).getDay();
          if (range.indexOf(day) > -1) {
            return true;
          } 
          d1 = new Date(d1).setDate(new Date(d1).getDate() + 1);
         }
          return false;};`;
        conditions.push(`isInDates(this.fact.${currentItem.factProp.min}, this.fact.${currentItem.factProp.max}, [${currentItem.value}])`);
        break;
      }
      case 'in array': {
        const array = [];
        currentItem.value.forEach((val) => {
          array.push(`this.fact.${currentItem.factProp} === '${val}'`);
        });
        conditions.push(`(${_.join(array, ' || ')})`);
        break;
      }
      default: {
        break;
      }
    }
  });
  const condition = `function(R) {${conditionsFuncs} R.when(${_.join(conditions, ' && ')});}`;
  let consequence = '';
  if (typeof ruleObj.action === 'string') {
    consequence = `function(R) {this.actions.push('${ruleObj.action}'); R.next();}`;
  } else {
    const tmpObj = Object.assign({}, ruleObj.action);
    Object.keys(ruleObj.action).forEach((item) => {
      tmpObj[item] = ruleObj.action[item].value;
    });
    // const obj = {
    //   errorID: ruleObj.conditions.error.value,
    //   action: tmpObj
    // };
    const obj = Object.assign({ errorID: ruleObj.conditions.error.value }, tmpObj);
    consequence = `function(R) {this.actions.push('${JSON.stringify(obj)}'); R.next();}`;
  }
  return { condition, consequence };
}


export default { json2rule };
