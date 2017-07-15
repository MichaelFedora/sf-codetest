import moment from 'moment';

export class Contact {
  constructor(contact) {
    if(typeof contact === 'object') {
      this.id = contact.id || '';
      this.firstname = contact.firstname || '';
      this.lastname = contact.lastname || '';
      this.phone = contact.phone || '';
      const z = contact.zip ? '' + contact.zip : '';
      this.zip  = z && z.length > 0 && z.length <= 5 ? ('00000'.slice(0, 5 - z.length) + z) : '';
      this.dob = moment.utc(contact.dob || null).format('YYYY-MM-DD');
    } else {
      this.id = '';
      this.firstname = '';
      this.lastname = '';
      this.phone = '';
      this.zip  = '';
      this.dob = moment.utc().format('YYYY-MM-DD');
    }
  }

  formattedDob() {
    return moment(this.dob).format('MM/DD/YYYY');
  }

  formattedPhone() {
    let ret = '';
    let p = this.phone;
    if(p.length > 10) {
      ret += p.substr(0, p.length - 10) + '-';
      p = p.substr(p.length - 10, 10);
    }
    ret += p.substr(0, 3) + '-' + p.substr(3, 3) + '-' + p.substr(6);
    return ret;
  }

  serialize() {
    const o = {
      firstname: this.firstname,
      lastname: this.lastname,
      phone: this.phone,
      zip: this.zip,
      dob: new Date(this.dob).toISOString(),
    };
    if(this.id) o.id = this.id;
    return o;
  }

  _default(val, def) {
    return val == null ? def : val;
  }

  setTo(contact) {
    if(typeof contact !== 'object') return;
    this.id = this._default(contact.id, this.id);
    this.firstname = this._default(contact.firstname, this.firstname);
    this.lastname = this._default(contact.lastname, this.lastname);
    this.phone = this._default(contact.phone, this.phone);
    const z = contact.zip ? '' + contact.zip : '';
    this.zip  = (z && z.length && z.length <= 5) ? ('00000'.slice(0, 5 - z.length) + z) : '';
    this.dob = moment.utc(contact.dob || null).format('YYYY-MM-DD');
  }

  empty() {
    return (this.firstname && this.lastname && this.phone && this.zip && this.dob) ? false : true;
  }
}
