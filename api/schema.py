from marshmallow import Schema, fields

class ContactSchema(Schema):
    '''A Contact'''
    id = fields.Str()
    firstname = fields.Str()
    lastname = fields.Str()
    dob = fields.DateTime()
    phone = fields.Str()
    zip = fields.Int()
